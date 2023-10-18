import router, { NextRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import axios from 'axios';

export const isAuthenticated = (): boolean => {
  const { 'access-token': accessToken, uid, client } = parseCookies();

  return !!accessToken && !!uid && !!client;
}

export const requireAuthentication = (pathname: string) => {
  const middleware = () => {
    const ignoreRoutes = ['/sign_in', '/sign_up'];
    
    if (!isAuthenticated() && !ignoreRoutes.includes(pathname)) {
      router.replace('/sign_in')
    }
  };

  return  middleware;
};

export const handleLogout = async () => {
  console.log(
    parseCookies()["access-token"],
    parseCookies().uid,
    parseCookies().client,
  )
  const axiosInstance = axios.create({
    baseURL: `http://localhost:3000/api/v1`,
    headers: {
      "access-token": parseCookies()["access-token"],
      client: parseCookies().client,
      uid: parseCookies().uid,
    },
    withCredentials: true,
  });

  try {
    await axiosInstance.delete('auth/sign_out');

    destroyCookie(null, 'uid');
    destroyCookie(null, 'client');
    destroyCookie(null, 'access-token');

    router.push("sign_in")
  } catch (err) {
    console.log(err)
  }
}
