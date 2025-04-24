import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TeamCard from '@/components/TeamCard';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const playerId = params.id;

  const player = await prisma.player.findUnique({
    where: { id: playerId }
  });

  if (!player) return notFound();

  const matches = await prisma.playerStats.findMany({
    where: {
      playerId
    },
    include: {
      match: true
    },
    orderBy: {
      match: {
        date: 'desc'
      }
    }
  });

  const monthStats = await prisma.playerStats.findMany({
    where: {
      playerId,
      match: {
        is: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }
    },
    include: {
      match: true
    }
  });

  const countMonth = monthStats.length;
  const monthKills = monthStats.reduce((sum, s) => sum + s.kills, 0);
  const monthDeaths = monthStats.reduce((sum, s) => sum + s.deaths, 0);
  const monthDamage = monthStats.reduce((sum, s) => sum + s.damage, 0);
  const monthKd = (monthKills / (monthDeaths || 1)).toFixed(2);
  const monthAdr = (monthDamage / (countMonth || 1)).toFixed(2);

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
              date: m.match.date
            })),
            avgKills: Number(
              (
                matches.reduce((acc, m) => acc + m.kills, 0) / matches.length || 0
              ).toFixed(2)
            ),
            avgDeaths: Number(
              (
                matches.reduce((acc, m) => acc + m.deaths, 0) / matches.length || 0
              ).toFixed(2)
            ),
            avgDamage: Number(
              (
                matches.reduce((acc, m) => acc + m.damage, 0) / matches.length || 0
              ).toFixed(2)
            )
          }
        ]}
        maps={matches.length}
      />
    </div>
  );
}