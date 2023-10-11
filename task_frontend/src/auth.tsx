import router, { NextRouter } from 'next/router';
import { parseCookies } from 'nookies';

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


