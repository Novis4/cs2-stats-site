'use client';
import Image from 'next/image';
import PlayerLink from './PlayerLink';
import {
  Card, CardHeader, CardContent,
  Table, TableBody, TableCell, TableHead, TableRow, TextField
} from '@mui/material';
import { PlayerStats } from '@prisma/client';

type Row = PlayerStats & { player:{ nickname:string; avatarUrl?:string|null } };

export default function TeamCard(
  { title, players, edit=false, maps, setMaps }:{
    title:string;
    players:Row[];
    edit?:boolean;
    maps:number;
    setMaps?:(v:number)=>void;
  }
){
  return (
    <Card sx={{ height:'100%' }}>
      {title && <CardHeader title={title} sx={{ textAlign:'center' }} />}
      <CardContent sx={{ p:0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={40}/>
              <TableCell>Игрок</TableCell>
              <TableCell align="right">K</TableCell>
              <TableCell align="right">D</TableCell>
              <TableCell align="right">Урон</TableCell>
              <TableCell align="right">K/D</TableCell>
              <TableCell align="right">ADR</TableCell>
              <TableCell align="right">Карт</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {players.map(p=>(
              <TableRow key={p.playerId}>
                {/* аватар */}
                <TableCell>
                  <Image
                    src={p.player.avatarUrl ?? '/avatar-placeholder.png'}
                    alt={p.player.nickname}
                    width={24} height={24}
                    style={{ borderRadius:'50%' }}
                  />
                </TableCell>

                {/* ник с ссылкой */}
                <TableCell>
                  <PlayerLink id={p.playerId}>{p.player.nickname}</PlayerLink>
                </TableCell>

                <TableCell align="right">{p.kills}</TableCell>
                <TableCell align="right">{p.deaths}</TableCell>
                <TableCell align="right">{p.damage}</TableCell>
                <TableCell align="right">{p.kd.toFixed(2)}</TableCell>
                <TableCell align="right">{p.adr.toFixed(1)}</TableCell>

                <TableCell align="right">
                  {edit
                    ? <TextField
                        size="small" type="number" sx={{ width:70 }}
                        value={maps}
                        onChange={e=>setMaps?.(+e.target.value)}
                      />
                    : maps}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
