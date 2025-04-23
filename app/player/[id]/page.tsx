'use client'
import { prisma } from '@/lib/prisma';
import { Avatar, Box, Divider, Grid, Paper, Typography } from '@mui/material';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const playerId = +params.id;

  const allStats = await prisma.playerStats.findMany({
    where: { playerId },
    include: { match: true }
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
    include: { match: true }
  });

  const totalKills = allStats.reduce((sum, s) => sum + s.kills, 0);
  const totalDeaths = allStats.reduce((sum, s) => sum + s.deaths, 0);
  const totalDamage = allStats.reduce((sum, s) => sum + s.damage, 0);
  const kd = (totalKills / (totalDeaths || 1)).toFixed(2);
  const adr = (totalDamage / (allStats.length || 1)).toFixed(0);

  const monthKills = monthStats.reduce((sum, s) => sum + s.kills, 0);
  const monthDeaths = monthStats.reduce((sum, s) => sum + s.deaths, 0);
  const monthDamage = monthStats.reduce((sum, s) => sum + s.damage, 0);
  const monthKd = (monthKills / (monthDeaths || 1)).toFixed(2);
  const monthAdr = (monthDamage / (monthStats.length || 1)).toFixed(0);
  const countMonth = monthStats.length;

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
              <Typography>Убийства: {monthKills}</Typography>
              <Typography>Смерти: {monthDeaths}</Typography>
              <Typography>Урон: {monthDamage}</Typography>
              <Typography>K/D: {monthKd}</Typography>
              <Typography>ADR: {monthAdr}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}