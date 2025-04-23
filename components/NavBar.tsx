'use client';
import Link from 'next/link';
import { AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const path = usePathname();
  const value = path.startsWith('/matches')
    ? 1
    : path.startsWith('/leaders')
    ? 2
    : path.startsWith('/stats')
    ? 3
    : 0;

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <Tabs value={value} textColor="inherit" indicatorColor="secondary">
          <Tab label="Последний матч"    component={Link} href="/" />
          <Tab label="Матчи"             component={Link} href="/matches" />
          <Tab label="TOP"               component={Link} href="/leaders" />
          <Tab label="Общая статистика"  component={Link} href="/stats" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
