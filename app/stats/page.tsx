'use client';
import useSWR from 'swr';
import Image from 'next/image';
import PlayerLink from '@/components/PlayerLink';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress } from '@mui/material';

const fetcher=(u:string)=>fetch(u).then(r=>r.json());
const fmt = (v:number|undefined,d=2)=>v===undefined?'—':v.toFixed(d);

export default function Stats() {
  const { data, error } = useSWR('/api/stats', fetcher);
  if (error) return <p style={{padding:16}}>Ошибка</p>;
  if (!data)  return <Box sx={{p:2}}><CircularProgress/></Box>;

  const columns = [
    {
      field:'nick', headerName:'Игрок', flex:1,
      renderCell:(p:any)=>(
        <>
          <Image src={p.row.avatarUrl??'/avatar-placeholder.png'} alt="" width={22} height={22} style={{borderRadius:'50%',marginRight:6}}/>
          <PlayerLink id={p.row.id}>{p.row.nick}</PlayerLink>
        </>
      )
    },
    {field:'kills',  headerName:'Убийства', width:110},
    {field:'deaths', headerName:'Смерти',   width:110},
    {field:'damage', headerName:'Урон',     width:110},
    {field:'kd',     headerName:'K/D',      width:90, valueFormatter:({value}:any)=>fmt(value,2)},
    {field:'games',  headerName:'Матчи',    width:90},
    {field:'kAvg',   headerName:'K ср.',    width:90, valueFormatter:({value}:any)=>fmt(value,1)},
    {field:'dAvg',   headerName:'D ср.',    width:90, valueFormatter:({value}:any)=>fmt(value,1)},
    {field:'adr',    headerName:'ADR',      width:90, valueFormatter:({value}:any)=>fmt(value,1)},
  ];

  return (
    <main style={{padding:16}}>
      <DataGrid
        autoHeight pageSizeOptions={[10]}
        rows={data.map((r:any,i:number)=>({id:r.id??i,...r}))}
        columns={columns}
      />
    </main>
  );
}
