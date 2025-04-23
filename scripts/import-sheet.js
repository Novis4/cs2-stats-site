// scripts/import-sheet.js
const fs = require('fs');
const csv = require('csv-parser');
const dayjs = require('dayjs');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();
const num = (s) => Number(String(s).replace(',', '.'));

const rows = [];
fs.createReadStream('matches.csv')
  .pipe(csv({ headers: false, mapValues: ({ value }) => value.trim() }))
  .on('data', (r) => rows.push({ c0: r[0], c2: r[2], c3: r[3] }))
  .on('end', async () => {
    let date = null;
    let team = 'A';
    let buf = [];

    const flush = async () => {
      if (buf.length !== 10 || !date) return;
      const match = await db.match.create({
        data: { matchDate: date, map: '', teamAScore: 0, teamBScore: 0 },
      });
      for (const p of buf) {
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
            kills: p.k,
            deaths: p.d,
            damage: 0,
            kd: p.k / Math.max(p.d, 1),
            adr: 0,
          },
        });
      }
      console.log(`✔  ${dayjs(date).format('DD.MM')} импортирован`);
      buf = [];
    };

    for (const r of rows) {
      const t = r.c0;

      if (t.startsWith('Игра')) {
        await flush();
        const m = t.match(/(\d{2})[.\-/](\d{2})/);   // "07.04"
        if (m) date = new Date(new Date().getFullYear(), +m[2] - 1, +m[1]);
        continue;
      }
      if (t.startsWith('Команда')) {
        team = t.includes('1') ? 'A' : 'B';
        continue;
      }
      if (t === '' || t === 'Имя') continue;

      const kills = num(r.c2);
      const deaths = num(r.c3);
      if (Number.isNaN(kills) || Number.isNaN(deaths)) continue;

      buf.push({ nick: t, team, k: kills, d: deaths });
      if (buf.length === 10) await flush();
    }
    await flush();
    console.log('=== Импорт завершён ===');
    process.exit(0);
  });