'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Box } from '@mui/material';

const fetcher=(u:string)=>fetch(u).then(r=>r.json());

export default function Matches() {
  const { data, error } = useSWR('/api/matches', fetcher);
  if (error) return <p style={{padding:16}}>Ошибка</p>;
  if (!data)  return <Box sx={{p:2}}><CircularProgress/></Box>;

  const rows = data.map((m:any)=>({
    id:    m.id,
    date:  new Date(m.matchDate).toLocaleDateString('ru-RU'),
    mapsQty: m.mapsPlayed,
    map:   m.map ?? '—',
    score: `${m.teamAScore}:${m.teamBScore}`,
  }));

  return (
    <main style={{padding:16}}>
      <DataGrid
        autoHeight pageSizeOptions={[10]}
        rows={rows}
        columns={[
          {field:'date', headerName:'Дата', width:110,
            renderCell:(p:any)=><Link href={`/match/${p.id}`}>{p.value}</Link>},
          {field:'mapsQty', headerName:'К-во карт', width:100},
          {field:'map',     headerName:'Карты',    flex:1},
          {field:'score',   headerName:'Счёт',     width:90},
        ]}
      />
    </main>
  );
}
