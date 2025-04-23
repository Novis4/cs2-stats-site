import Image from 'next/image';
import Link from 'next/link';
import PlayerLink from '@/components/PlayerLink';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { Tabs, Tab, Grid, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default async function Leaders({ searchParams }:{ searchParams:{ p?:string }}) {
  const period = searchParams.p ?? 'all';          // all | month | last

  let where:any = {};
  if (period==='month') where.match = { matchDate:{ gte: dayjs().subtract(1,'month').toDate() }};
  if (period==='last')  {
    const last = await prisma.match.findFirst({ orderBy:{ matchDate:'desc' }});
    if (last) where.matchId = last.id;
  }

  const groups = await prisma.playerStats.groupBy({
    by:['playerId'],
    where,
    _sum:{ kills:true, deaths:true, damage:true },
    _count:{ _all:true },
  });

  const rows = await Promise.all(groups.map(async g=>{
    const p = await prisma.player.findUnique({ where:{ id:g.playerId }});
    const k = Number(g._sum.kills);
    const d = Number(g._sum.deaths);
    const dmg = Number(g._sum.damage);
    const games = g._count._all;
    return {
      id:  p!.id,
      nick: p!.nickname,
      avatarUrl: p!.avatarUrl,
      kd:  k / Math.max(d,1),
      adr: dmg / games / 30,
    };
  }));

  const topKD  = [...rows].sort((a,b)=>b.kd  - a.kd ).slice(0,15);
  const topADR = [...rows].sort((a,b)=>b.adr - a.adr).slice(0,15);
  const trophy = (i:number)=> i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1;

  const Col = (label:string,field:'kd'|'adr',data:any[])=>(
    <Table size="small" sx={{'& th, & td':{px:1}}}>
      <TableHead>
        <TableRow><TableCell width={34}>#</TableCell><TableCell>Игрок</TableCell><TableCell align="right" width={70}>{label}</TableCell></TableRow>
      </TableHead>
      <TableBody>
        {data.map((r,i)=>(
          <TableRow key={r.id}>
            <TableCell>{trophy(i)}</TableCell>
            <TableCell sx={{display:'flex',alignItems:'center',gap:6}}>
              <Image src={r.avatarUrl??'/avatar-placeholder.png'} alt="" width={22} height={22} style={{borderRadius:'50%'}}/>
              <PlayerLink id={r.id}>{r.nick}</PlayerLink>
            </TableCell>
            <TableCell align="right">{r[field].toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <main style={{padding:16}}>
      <Tabs value={period} sx={{mb:2}}>
        <Tab component={Link} href="/leaders?p=all"   value="all"   label="ВСЁ"   />
        <Tab component={Link} href="/leaders?p=month" value="month" label="МЕСЯЦ"/>
        <Tab component={Link} href="/leaders?p=last"  value="last"  label="ИГРА" />
      </Tabs>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>{Col('K/D','kd',  topKD )}</Grid>
        <Grid item xs={12} md={6}>{Col('ADR','adr', topADR)}</Grid>
      </Grid>
    </main>
  );
}
