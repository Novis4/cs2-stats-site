'use client';
import Link from 'next/link';

export default function PlayerLink({ id, children }:{ id:number; children:any }) {
  return <Link href={`/player/${id}`} style={{ color:'inherit', textDecoration:'none' }}>
           {children}
         </Link>;
}
