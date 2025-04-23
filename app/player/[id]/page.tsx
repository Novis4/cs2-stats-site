import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getPlayerStats } from '@/lib/playerStats';
import { Box, Grid, Paper, Typography } from '@mui/material';

export default async function PlayerPage({ params }:{ params:{ id:string }}) {
  const id = +params.id;
  const player = await prisma.player.findUnique({ where:{ id }});
  if (!player) return <p style={{padding:16}}>Игрок не найден</p>;

  const { all, month } = await getPlayerStats(id);

  const Stat = ({title,val}:{title:string;val:any})=>(
    <Box sx={{display:'flex',justifyContent:'space-between'}}>
      <span>{title}</span><b>{val}</b>
    </Box>
  );

  const Card = (title:string,s:any)=>(
    <Paper sx={{p:2}}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Stat title="Убийства" val={s.kills}/>
      <Stat title="Смерти"   val={s.deaths}/>
      <Stat title="Урон"     val={s.damage}/>
      <Stat title="K/D"      val={s.kd.toFixed(2)}/>
      <Stat title="ADR"      val={s.adr.toFixed(1)}/>
      <Stat title="Карт"     val={s.games}/>
    </Paper>
  );

  return (
    <main style={{padding:24,maxWidth:900}}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{p:3,textAlign:'center'}}>
            <Image src={player.avatarUrl ?? '/avatar-placeholder.png'}
                   alt={player.nickname}
                   width={160} height={160}
                   style={{borderRadius:'50%',objectFit:'cover'}}/>
            <Typography variant="h5" sx={{mt:2}}>{player.nickname}</Typography>
            {player.realName && <Typography variant="body2" color="gray">{player.realName}</Typography>}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>{Card('За всё время',all)}</Grid>
            <Grid item xs={12}>{Card('За последний месяц',month)}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
}
