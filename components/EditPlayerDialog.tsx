'use client';
import { useState } from 'react';
import { Dialog, TextField, Button } from '@mui/material';

export default function EditPlayerDialog({ player }:{ player:any }) {
  const [open,setOpen]=useState(false);
  const [nick,setNick]=useState(player.nickname);
  const [name,setName]=useState(player.realName ?? '');
  const [url, setUrl] =useState(player.avatarUrl ?? '');

  const save = async () => {
    await fetch(`/api/player/${player.id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ nickname:nick, realName:name, avatarUrl:url })
    });
    setOpen(false);
    location.reload();
  };

  return <>
    <Button size="small" onClick={()=>setOpen(true)}>Редактировать</Button>
    <Dialog open={open} onClose={()=>setOpen(false)}>
      <div style={{padding:24,display:'flex',flexDirection:'column',gap:12}}>
        <TextField label="Никнейм"   value={nick} onChange={e=>setNick(e.target.value)}/>
        <TextField label="Имя"       value={name} onChange={e=>setName(e.target.value)}/>
        <TextField label="Avatar URL" value={url} onChange={e=>setUrl(e.target.value)}/>
        <Button variant="contained" onClick={save}>Сохранить</Button>
      </div>
    </Dialog>
  </>;
}
