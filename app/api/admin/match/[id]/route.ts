import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }:{ params:{ id:string }}) {
  const matchId = +params.id;
  const { updates, teamAResult, teamBResult, mapsPlayed } = await req.json();

  await prisma.match.update({
    where:{ id:matchId },
    data:{ teamAResult, teamBResult, mapsPlayed },
  });

  if (Array.isArray(updates)) {
    for (const u of updates) {
      await prisma.playerStats.updateMany({
        where:{ matchId, playerId:u.playerId },
        data:{
          kills:u.kills, deaths:u.deaths, damage:u.damage,
          kd:u.kills/Math.max(u.deaths,1), adr:u.damage/30,
        },
      });
    }
  }
  return NextResponse.json({ ok:true });
}
