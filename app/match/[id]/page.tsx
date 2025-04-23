'use client';
import { useState, useEffect } from 'react';
import { Grid, Typography, IconButton, Button, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TeamCard from '@/components/TeamCard';

export default function Match({ params }:{ params:{ id:string }}) {
  const [match,setMatch]=useState<any>(null);
  const [edit,setEdit]=useState(false);
  const [maps,setMaps]=useState(1);
  const [team,setTeam]=useState<{A:string,B:string}>({A:'',B:''});

  useEffect(()=>{
    fetch(`/api/match/${params.id}`).then(r=>r.json()).then(m=>{
      setMatch(m);
      setMaps(m.mapsPlayed);
      setTeam({A:m.teamAResult||'',B:m.teamBResult||''});
    });
  },[params.id]);

  if(!match) return <p style={{padding:16}}>Загрузка…</p>;

  const save = async () => {
    await fetch(`/api/admin/match/${match.id}`,{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        mapsPlayed:maps,
        teamAResult:team.A||null,
        teamBResult:team.B||null,
        updates:match.stats.map((s:any)=>({
          playerId:s.playerId,kills:s.kills,deaths:s.deaths,damage:s.damage
        })),
      }),
    });
    setEdit(false);
    location.reload();
  };

  const list = (t:'A'|'B')=>match.stats.filter((s:any)=>s.team===t);

  const header=(t:'A'|'B')=>(
    <Typography variant="h6" sx={{textAlign:'center',mb:1}}>
      Команда {t}&nbsp;(
        {edit
          ? <Select size="small" sx={{width:60}}
              value={team[t]} onChange={e=>setTeam({...team,[t]:e.target.value})}>
              <MenuItem value="">—</MenuItem><MenuItem value="W">W</MenuItem><MenuItem value="L">L</MenuItem>
            </Select>
          : team[t]||'—'}
      )
    </Typography>
  );

  return (
    <main style={{padding:16}}>
      <Typography variant="h4" sx={{display:'flex',alignItems:'center',mb:2}}>
        Матч {new Date(match.matchDate).toLocaleDateString('ru-RU')}
        <IconButton onClick={()=>edit?save():setEdit(true)} sx={{ml:1}}>
          {edit?<SaveIcon/>:<EditIcon/>}
        </IconButton>
        <span style={{marginLeft:24}}>Карт:&nbsp;
          {edit
            ? <input type="number" style={{width:60}} value={maps}
                onChange={e=>setMaps(+e.target.value)}/>
            : maps}
        </span>
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {header('A')}
          <TeamCard title="" players={list('A')} edit={edit}
            maps={maps} setMaps={setMaps}/>
        </Grid>
        <Grid item xs={12} md={6}>
          {header('B')}
          <TeamCard title="" players={list('B')} edit={edit}
            maps={maps} setMaps={setMaps}/>
        </Grid>
      </Grid>
    </main>
  );
}
