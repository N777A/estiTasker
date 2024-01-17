import './globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppProps } from "next/app";
import PropTypes from "prop-types";
import { requireAuthentication } from "../auth";
import { useRouter } from "next/router";
import Navbar from '../components/common/Navbar'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useEffect, useState } from 'react';

dayjs.locale('ja')

function MyApp(props: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { Component, pageProps } = props;

  useEffect(() => {
    requireAuthentication(currentPath)();
  }, [currentPath]);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
