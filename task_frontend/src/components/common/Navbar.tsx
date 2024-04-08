import React, { useEffect, useState } from 'react';
import { handleLogout } from '../../auth'
import Link from 'next/link';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  const hideLogoutOnPages = ['/sign_in', '/sign_up'];
  const [isClientSide, setIsClientSide] = useState(false);
  const hideLogout =  isClientSide ? hideLogoutOnPages.includes(router.pathname) : false;

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  return (
    <nav className="flex border-b-2 p-2 h-8">
      <div className="text-xs">
        <Link href="/projects" className='text-blue-600 font-bold' >
          EstiTasker
        </Link>
      </div>
      <div className="grow"></div>
      {!hideLogout && (
        <Button className="text-xs" onClick={handleLogout}>
          ログアウト
        </Button>
      )}
    </nav>
  )
}

export default  Navbar;
