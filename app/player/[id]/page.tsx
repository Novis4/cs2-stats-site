'use client'
import { prisma } from '@/lib/prisma';
import { Avatar, Box, Divider, Grid, Paper, Typography } from '@mui/material';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const playerId = +params.id;

  const allStats = await prisma.playerStats.findMany({
    where: { playerId },
    include: { match: true }
  });

  const monthStats = await prisma.playerStats.groupBy({
    by: ['playerId'],
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
    _sum: {
      kills: true,
      deaths: true,
      damage: true
    },
    _count: {
      playerId: true
    }
  });

  const totalKills = allStats.reduce((sum, s) => sum + s.kills, 0);
  const totalDeaths = allStats.reduce((sum, s) => sum + s.deaths, 0);
  const totalDamage = allStats.reduce((sum, s) => sum + s.damage, 0);
  const kd = (totalKills / (totalDeaths || 1)).toFixed(2);
  const adr = (totalDamage / (allStats.length || 1)).toFixed(0);

  const m = monthStats[0]?._sum || {};
  const countMonth = monthStats[0]?._count?.playerId || 0;

  return (
    <Box p={2}>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar sx={{ width: 64, height: 64 }} />
            <Typography variant="h6">Игрок #{playerId}</Typography>
          </Grid>
          <Grid item xs>
            <Typography>Убийства: {totalKills}</Typography>
            <Typography>Смерти: {totalDeaths}</Typography>
            <Typography>Урон: {totalDamage}</Typography>
            <Typography>K/D: {kd}</Typography>
            <Typography>ADR: {adr}</Typography>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>За месяц</Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography>Матчей: {countMonth}</Typography>
              <Typography>Убийства: {m.kills || 0}</Typography>
              <Typography>Смерти: {m.deaths || 0}</Typography>
              <Typography>Урон: {m.damage || 0}</Typography>
              <Typography>K/D: {((m.kills || 0) / ((m.deaths || 1))).toFixed(2)}</Typography>
              <Typography>ADR: {(m.damage ? (m.damage / countMonth).toFixed(0) : 0)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}