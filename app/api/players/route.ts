import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// вернуть список всех игроков (id + nickname)
export async function GET() {
  const players = await prisma.player.findMany({
    select: { id: true, nickname: true },
    orderBy: { nickname: 'asc' },
  });
  return NextResponse.json(players);
}

// (необязательно) позволит добавлять игроков POST-запросом
export async function POST(req: Request) {
  const { nickname } = await req.json();
  if (!nickname) {
    return NextResponse.json({ error: 'nickname required' }, { status: 400 });
  }
  const player = await prisma.player.create({ data: { nickname } });
  return NextResponse.json(player, { status: 201 });
}
