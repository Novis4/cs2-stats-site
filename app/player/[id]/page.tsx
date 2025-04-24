'use client';

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TeamCard from '@/components/TeamCard';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const playerId = parseInt(params.id);
  if (isNaN(playerId)) return notFound();

  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) return notFound();

  const monthStats = await prisma.playerStats.findMany({
  where: {
    playerId,
    match: {
      is: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
  },
  include: {
    match: true,
  },
});

  return (
    <div className="p-4 space-y-4">
      <TeamCard
        title={player.name}
        players={matches.map((m) => ({
          id: m.playerId,
          name: player.name,
          kills: m.kills,
          deaths: m.deaths,
          damage: m.damage,
        }))}
        maps={matches.length}
      />
    </div>
  );
}