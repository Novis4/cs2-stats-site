'use client'

import { prisma } from '@/lib/prisma'
import { Avatar, Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { notFound } from 'next/navigation'

export default async function PlayerProfile({ params }: { params: { id: string } }) {
  const playerId = Number(params.id)
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { stats: true },
  })

  if (!player) return notFound()

  const all = await prisma.playerStats.groupBy({
    by: ['playerId'],
    where: { playerId },
    _sum: { kills: true, deaths: true, damage: true },
    _count: { playerId: true },
  })

  const month = await prisma.playerStats.groupBy({
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
}
    _sum: { kills: true, deaths: true, damage: true },
    _count: { playerId: true },
  })

  const sumAll = all[0]?._sum || {}
  const countAll = all[0]?._count?.playerId || 0
  const sumMonth = month[0]?._sum || {}
  const countMonth = month[0]?._count?.playerId || 0

  const totalKills = sumAll.kills ?? 0
  const totalDeaths = sumAll.deaths ?? 0
  const totalDamage = sumAll.damage ?? 0
  const kd = totalDeaths ? (totalKills / totalDeaths).toFixed(2) : '∞'
  const adr = countAll ? (totalDamage / countAll).toFixed(2) : '0.00'

  const monthKills = sumMonth.kills ?? 0
  const monthDeaths = sumMonth.deaths ?? 0
  const monthDamage = sumMonth.damage ?? 0
  const monthKd = monthDeaths ? (monthKills / monthDeaths).toFixed(2) : '∞'
  const monthAdr = countMonth ? (monthDamage / countMonth).toFixed(2) : '0.00'

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3} textAlign="center">
            <Avatar
              src={player.avatarUrl || undefined}
              sx={{ width: 128, height: 128, margin: '0 auto', mb: 2 }}
            />
            <Typography variant="h6">{player.nickname}</Typography>
            <Typography variant="body2">{player.realName}</Typography>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" gutterBottom>Общая статистика</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography>Матчей: {countAll}</Typography>
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
  )
}