import router from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';
import apiClient from './apiClient'
import axios, { Axios } from 'axios';

const AUTH_COOKIE_KEYS = ['access-token', 'uid', 'client'];
const IGNORE_ROUTES = ['/sign_in', '/sign_up'];
const SIGN_IN_ROUTE = '/sign_in';
const SIGN_OUT_ENDPOINT = '/auth/sign_out';

export const isAuthenticated = (): boolean => {
  const cookies = parseCookies();
  return AUTH_COOKIE_KEYS.every(key => !!cookies[key]);
};

export const requireAuthentication = (pathname:string) => {
  const middleware = () => {
    if (!isAuthenticated() && !IGNORE_ROUTES.includes(pathname)) {
      router.replace(SIGN_IN_ROUTE)
    }
  };

  return middleware;
}

export const handleLogout = async () => {
  try {
    await apiClient.delete(SIGN_OUT_ENDPOINT)

    AUTH_COOKIE_KEYS.forEach(key => destroyCookie(null, key));

    router.push(SIGN_IN_ROUTE);
  } catch (err) {
    console.error(err);
  }
}
