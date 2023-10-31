import React from 'react';
import { handleLogout } from '../../auth'
import { parseCookies } from "nookies";

const Navbar: React.FC = () => {

  const handleCashe = () => {
    console.log(
      parseCookies().client,
      parseCookies().uid,
      parseCookies()["access-token"]
    );
  }
  return (
    <nav>
      <button onClick={handleLogout}>
        ログアウト
      </button>
      <button onClick={handleCashe}>
        キャッシュ確認
      </button>
    </nav>
  )
}

export default  Navbar;
