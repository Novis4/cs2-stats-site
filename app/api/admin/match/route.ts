import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req:Request){
  const { rows, mapsPlayed, map, teamAScore, teamBScore, matchDate } = await req.json();

  const match = await prisma.match.create({
    data:{
      matchDate: matchDate ? new Date(matchDate) : new Date(),
      map,
      mapsPlayed,
      teamAScore,
      teamBScore,
    },
  });

  for (const r of rows.filter((x:any)=>x.playerId)){
    await prisma.playerStats.create({
      data:{
        match:  { connect:{ id:match.id }},
        player: { connect:{ id:+r.playerId }},
        team:   r.team,
        kills:  r.kills,
        deaths: r.deaths,
        damage: r.damage,
        kd:     r.kills/Math.max(r.deaths,1),
        adr:    r.damage/30,
      },
    });
  }

  return NextResponse.json({ ok:true });
}
