import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }:{ params:{ id:string }}) {
  const id = Number(params.id);
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      stats: {
        include: {
          player: {           // ⬅️ теперь берём и url
            select: { nickname: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json(match);
}
