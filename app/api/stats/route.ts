import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET() {
  const groups = await prisma.playerStats.groupBy({
    by: ['playerId'],
    _sum: { kills:true, deaths:true, damage:true },
    _count:{ _all:true },
  });

  const data = await Promise.all(
    groups.map(async g=>{
      const p = await prisma.player.findUnique({ where:{ id:g.playerId }});
      const kills  = Number(g._sum.kills);
      const deaths = Number(g._sum.deaths);
      const dmg    = Number(g._sum.damage);
      const games  = g._count._all;
      return {
        id:   p!.id,                  // ← добавили ID
        nick: p!.nickname,
        avatarUrl: p!.avatarUrl,
        kills, deaths, damage: dmg,
        kd:   kills / Math.max(deaths,1),
        games,
        kAvg: kills / games,
        dAvg: deaths / games,
        adr:  dmg   / games / 30,
      };
    }),
  );

  data.sort((a,b)=>b.kd - a.kd);
  return NextResponse.json(data);
}
