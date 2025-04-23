import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const matches = await prisma.match.findMany({
    orderBy:{ matchDate:'desc' },
    include:{ stats:{ select:{ damage:true } } },
  });
  return NextResponse.json(matches.map(m=>({
    id:m.id,
    matchDate:m.matchDate,
    map:m.map,
    teamAScore:m.teamAScore,
    teamBScore:m.teamBScore,
    damage:m.stats.reduce((s,v)=>s+v.damage,0),
    mapsPlayed:m.mapsPlayed,
  })));
}
