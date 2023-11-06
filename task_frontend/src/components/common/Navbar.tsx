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
    <nav className="flex border-b-2 p-2">
      <div className="text-xs">プロジェクト管理ツール</div>
      <div className="grow"></div>
      <button className="text-xs" onClick={handleLogout}>
        ログアウト
      </button>
      {/* <button onClick={handleCashe}>
        キャッシュ確認
      </button> */}
    </nav>
  )
}

export default  Navbar;
