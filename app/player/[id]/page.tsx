'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TeamCard from '@/components/TeamCard'; // Заменили Card на TeamCard
import { Match, Player, PlayerStats } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type PlayerProfile = Player & {
  stats: (PlayerStats & { match: Match })[];
};

export default function PlayerPage() {
  const params = useParams();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      const res = await fetch(`/api/player/${params.id}`);
      if (!res.ok) return;

      const data = await res.json();
      setPlayer(data);
    };

    fetchPlayer();
  }, [params.id]);

  if (!player) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <TeamCard>
        <h1 className="text-xl font-bold">{player.name}</h1>
        <p>ID: {player.id}</p>
      </TeamCard>

      <h2 className="text-lg font-semibold mt-4">Последние матчи:</h2>
      <ul>
        {player.stats.map(stat => (
          <li key={stat.id}>
            Матч #{stat.match.id} — Убийства: {stat.kills}, Смерти: {stat.deaths}
          </li>
        ))}
      </ul>
    </div>
  );
}