import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { nickname, realName, avatarUrl } = await req.json();

  await prisma.player.update({
    where: { id: +params.id },
    data:  { nickname, realName, avatarUrl },
  });

  return NextResponse.json({ ok: true });
}
