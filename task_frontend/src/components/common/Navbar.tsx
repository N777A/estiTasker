import React from 'react';
import { handleLogout } from '../../auth'
import { parseCookies } from "nookies";
import Link from 'next/link';
import { Button } from '@mui/material';

const Navbar: React.FC = () => {

  const handleCashe = () => {
    console.log(
      parseCookies().client,
      parseCookies().uid,
      parseCookies()["access-token"]
    );
  }
  
  return (
    <nav className="flex border-b-2 p-2 h-8">
      <div className="text-xs">
        <Link href="/projects" className='text-blue-600 font-bold' >
          EstiTasker
        </Link>
      </div>
      <div className="grow"></div>
      <Button className="text-xs" onClick={handleLogout}>
        ログアウト
      </Button>
    </nav>
  )
}

export default  Navbar;
