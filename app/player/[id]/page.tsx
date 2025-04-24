import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
  })

  if (!player) return notFound()

  const totalStats = await prisma.playerStats.aggregate({
    where: { playerId: player.id },
    _sum: { kills: true, deaths: true, damage: true },
    _count: { _all: true },
  })

  const monthStats = await prisma.playerStats.aggregate({
    where: {
      playerId: player.id,
      match: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    _sum: { kills: true, deaths: true, damage: true },
    _count: { _all: true },
  })

  const totalGames = totalStats._count._all ?? 0
  const totalKills = totalStats._sum.kills ?? 0
  const totalDeaths = totalStats._sum.deaths ?? 0
  const totalDamage = totalStats._sum.damage ?? 0

  const monthGames = monthStats._count._all ?? 0
  const monthKills = monthStats._sum.kills ?? 0
  const monthDeaths = monthStats._sum.deaths ?? 0
  const monthDamage = monthStats._sum.damage ?? 0

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <Image src={player.avatar} alt={player.name} width={120} height={120} className="rounded-xl" />
        <div className="text-center sm:text-left mt-2 sm:mt-0">
          <h1 className="text-2xl font-bold">{player.name}</h1>
          <p className="text-gray-500">{player.nickname}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Общая статистика" />
          <CardContent className="space-y-1">
            <p>Карты: {totalGames}</p>
            <p>Убийства: {totalKills}</p>
            <p>Смерти: {totalDeaths}</p>
            <p>Урон: {totalDamage}</p>
            <p>KD: {(totalKills / totalDeaths || 0).toFixed(2)}</p>
            <p>ADR: {(totalDamage / totalGames || 0).toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="За месяц" />
          <CardContent className="space-y-1">
            <p>Карты: {monthGames}</p>
            <p>Убийства: {monthKills}</p>
            <p>Смерти: {monthDeaths}</p>
            <p>Урон: {monthDamage}</p>
            <p>KD: {(monthKills / monthDeaths || 0).toFixed(2)}</p>
            <p>ADR: {(monthDamage / monthGames || 0).toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}