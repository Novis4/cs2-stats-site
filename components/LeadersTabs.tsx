'use client';
import { Tabs, Tab } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LeadersTabs() {
  const router = useRouter();
  const params = useSearchParams();
  const m = params.get('m') ?? 'kd';
  const p = params.get('p') ?? 'all';
  const value = `${m}-${p}`;

  const go = (_:any, v:string) => {
    const [nm, np] = v.split('-');
    router.push(`/leaders?m=${nm}&p=${np}`);
  };

  return (
    <Tabs value={value} onChange={go} variant="scrollable" scrollButtons="auto">
      <Tab value="kd-all"   label="K/D • всё"   />
      <Tab value="kd-month" label="K/D • месяц" />
      <Tab value="kd-last"  label="K/D • игра"  />
      <Tab value="adr-all"  label="ADR • всё"   />
      <Tab value="adr-month"label="ADR • месяц" />
      <Tab value="adr-last" label="ADR • игра"  />
    </Tabs>
  );
}
