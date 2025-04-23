'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Box, Typography, Grid, Select, MenuItem, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function Admin() {
  const { data:players } = useSWR('/api/players', fetcher);

  const [rows,setRows]=useState(
    Array.from({length:10},()=>({ playerId:'', team:'A', kills:0, deaths:0, damage:0 }))
  );
  const [maps,setMaps]  =useState(1);
  const [scoreA,setA]   =useState(0);
  const [scoreB,setB]   =useState(0);
  const [mapName,setMap]=useState('');
  const [date,setDate]  =useState(dayjs().format('YYYY-MM-DD'));   // ← новая дата

  if(!players) return <Typography sx={{p:4}}>Загрузка игроков…</Typography>;

  const h=(i:number,k:string,v:any)=>setRows(r=>r.map((row,idx)=>idx===i? {...row,[k]:v}:row));

  const save=async()=>{
    await fetch('/api/admin/match',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        rows,
        mapsPlayed:maps,
        map:mapName,
        teamAScore:scoreA,
        teamBScore:scoreB,
        matchDate: date,                 // ⬅️ передаём дату
      }),
    });
    alert('Матч сохранён');
  };

  return (
    <Box sx={{p:2,maxWidth:1000}}>
      <Typography variant="h5" gutterBottom>Новый матч</Typography>

      <Grid container spacing={1} sx={{mb:2}}>
        <Grid item><TextField label="Дата" type="date" size="small"
                              value={date}  onChange={e=>setDate(e.target.value)}/></Grid>
        <Grid item><TextField label="К-во карт" type="number" size="small"
                              value={maps}  onChange={e=>setMaps(+e.target.value)}/></Grid>
        <Grid item><TextField label="Счёт A"   type="number" size="small"
                              value={scoreA} onChange={e=>setA(+e.target.value)}/></Grid>
        <Grid item><TextField label="Счёт B"   type="number" size="small"
                              value={scoreB} onChange={e=>setB(+e.target.value)}/></Grid>
        <Grid item sx={{flexGrow:1}}>
          <TextField fullWidth label="Карты (список)" size="small"
                     value={mapName} onChange={e=>setMap(e.target.value)}/>
        </Grid>
      </Grid>

      {/* --- таблица игроков (без изменений) --- */}
      {rows.map((r,i)=>(
        <Grid key={i} container spacing={1} sx={{mb:1}}>
          <Grid item xs={12} md={3}>
            <Select fullWidth value={r.playerId}
                    onChange={e=>h(i,'playerId',e.target.value)}>
              {players.map((p:any)=><MenuItem key={p.id} value={p.id}>{p.nickname}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={4} md={1.2}><TextField fullWidth label="K"  type="number" value={r.kills}  onChange={e=>h(i,'kills', +e.target.value)}/></Grid>
          <Grid item xs={4} md={1.2}><TextField fullWidth label="D"  type="number" value={r.deaths} onChange={e=>h(i,'deaths',+e.target.value)}/></Grid>
          <Grid item xs={4} md={1.6}><TextField fullWidth label="DMG"type="number" value={r.damage} onChange={e=>h(i,'damage',+e.target.value)}/></Grid>
          <Grid item xs={12} md={2}>
            <Select fullWidth value={r.team}
                    onChange={e=>h(i,'team',e.target.value)}>
              <MenuItem value="A">A</MenuItem><MenuItem value="B">B</MenuItem>
            </Select>
          </Grid>
        </Grid>
      ))}

      <Button variant="contained" onClick={save}>Сохранить матч</Button>
    </Box>
  );
}
