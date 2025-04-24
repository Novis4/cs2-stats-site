import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TeamCard from '@/components/TeamCard';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return notFound();

  const player = await prisma.player.findUnique({
    where: { id }
  });
  if (!player) return notFound();

  const matches = await prisma.playerStats.findMany({
    where: {
      playerId: id,
      match: {
        is: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }
    },
    include: { match: true },
    orderBy: { match: { date: 'desc' } }
  });

  return (
    <div className="p-4 space-y-4">
      <TeamCard
        title={`Профиль игрока ${player.name}`}
        players={[
          {
            name: player.name,
            id: player.id,
            stats: matches.map((m) => ({
              kills: m.kills,
              deaths: m.deaths,
              damage: m.damage,
              date: m.match.date,
            })),
          }
        ]}
        maps={matches.length}
      />
    </div>
  );
}
