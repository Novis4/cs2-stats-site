// scripts/import-sheet.ts
import fs from 'fs';
import csv from 'csv-parser';
import dayjs from 'dayjs';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// утилита: превратить "1,75" → 1.75
const toNum = (s: string) => Number(String(s).replace(',', '.'));

interface RowRaw {
  col0: string;
  col2: string;
  col3: string;
}

// ------------------------------------------------------------------
// CSV прочитаем без заголовков: в Google-экспорте всё в одной линии
// ------------------------------------------------------------------
const rows: RowRaw[] = [];

fs.createReadStream('matches.csv')
  .pipe(
    csv({
      headers: false,         // берём по индексам
      mapValues: ({ value }) => value.trim(),  // обрежем пробелы
    }),
  )
  .on('data', (row: any) => {
    rows.push({
      col0: row[0],           // Имя / Команда 1 / Игра 07.04 / …
      col2: row[2],           // Kills
      col3: row[3],           // Deaths
    });
  })
  .on('end', async () => {
    let currentDate: Date | null = null;
    let currentTeam: 'A' | 'B' = 'A';
    let buffer: { nick: string; team: 'A' | 'B'; kills: number; deaths: number }[] = [];

    const flushMatch = async () => {
      if (buffer.length !== 10 || !currentDate) return;          // пропустим битые фрагменты
      // создаём матч
      const match = await db.match.create({
        data: { matchDate: currentDate, map: '', teamAScore: 0, teamBScore: 0 },
      });
      // пишем игроков
      for (const p of buffer) {
        const player = await db.player.upsert({
          where: { nickname: p.nick },
          update: {},
          create: { nickname: p.nick },
        });
        await db.playerStats.create({
          data: {
            matchId: match.id,
            playerId: player.id,
            team: p.team,
            kills: p.kills,
            deaths: p.deaths,
            damage: 0,                  // в CSV его нет
            kd: p.kills / Math.max(p.deaths, 1),
            adr: 0,
          },
        });
      }
      console.log(`✔  Импортирован матч ${dayjs(currentDate).format('DD.MM')} (${buffer[0].team} vs ${buffer[5].team})`);
      buffer = [];
    };

    for (const r of rows) {
      const txt = r.col0;

      // --- новая игра ---
      if (txt.startsWith('Игра')) {
        // перед переходом сбросим прошлый матч
        await flushMatch();

        const m = txt.match(/(\d{2})[.\-\/](\d{2})/);   // "07.04"
        if (!m) continue;
        const day = Number(m[1]);
        const mon = Number(m[2]);
        const year = new Date().getFullYear();
        currentDate = new Date(year, mon - 1, day);
        continue;
      }

      // --- переключение команды ---
      if (txt.startsWith('Команда')) {
        currentTeam = txt.includes('1') ? 'A' : 'B';
        continue;
      }

      // --- пропускаем строки-заголовки ("Имя", пустые) ---
      if (txt === '' || txt === 'Имя') continue;

      // --- это строка игрока ---
      const kills = toNum(r.col2);
      const deaths = toNum(r.col3);

      if (Number.isNaN(kills) || Number.isNaN(deaths)) continue;   // защитимся от мусора

      buffer.push({ nick: txt, team: currentTeam, kills, deaths });

      // как только накопили 10 игроков → один матч
      if (buffer.length === 10) await flushMatch();
    }

    // вдруг файл закончился ровно на матч
    await flushMatch();
    console.log('=== Импорт завершён ===');
    process.exit(0);
  });
