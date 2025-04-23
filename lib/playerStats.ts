import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function getPlayerStats(playerId:number) {
  // всё время
  const all = await prisma.playerStats.aggregate({
    where:{ playerId },
    _sum:{ kills:true,deaths:true,damage:true },
    _count:{ _all:true },
  });
  // месяц
  const month = await prisma.playerStats.aggregate({
    where:{
      playerId,
      match:{ matchDate:{ gte: dayjs().subtract(1,'month').toDate() } },
    },
    _sum:{ kills:true,deaths:true,damage:true },
    _count:{ _all:true },
  });

  const build = (o:any)=>({
    kills:   Number(o._sum.kills??0),
    deaths:  Number(o._sum.deaths??0),
    damage:  Number(o._sum.damage??0),
    games:   o._count._all,
    kd:      (Number(o._sum.kills)||0)/Math.max(Number(o._sum.deaths)||1,1),
    adr:     (Number(o._sum.damage)||0)/Math.max(o._count._all,1)/30,
  });

  return { all:build(all), month:build(month) };
}
