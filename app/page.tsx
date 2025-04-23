import { prisma } from '@/lib/prisma';
import { Grid, Typography } from '@mui/material';
import TeamCard from '@/components/TeamCard';

export default async function Home() {
  // берём самый свежий матч + avatarUrl у игроков
  const match = await prisma.match.findFirst({
    orderBy: { matchDate: 'desc' },
    include: {
      stats: {
        include: {
          player: {
            select: { nickname: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (!match) return <p style={{ padding: 16 }}>Матчей пока нет.</p>;

  const teamA = match.stats.filter((s) => s.team === 'A');
  const teamB = match.stats.filter((s) => s.team === 'B');

  return (
    <main style={{ padding: 16 }}>
      <Typography variant="h3" gutterBottom>
        Последний матч — {match.matchDate.toLocaleDateString('ru-RU')} (
        {match.mapsPlayed})
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TeamCard title={`Команда A (${match.teamAScore})`} players={teamA} maps={match.mapsPlayed} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TeamCard title={`Команда B (${match.teamBScore})`} players={teamB} maps={match.mapsPlayed} />
        </Grid>
      </Grid>
    </main>
  );
}
