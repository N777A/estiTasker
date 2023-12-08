import './globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as React from "react";
import { AppProps } from "next/app";
import PropTypes from "prop-types";
import { requireAuthentication } from "../auth";
import { useRouter } from "next/router";
import Navbar from '../components/common/Navbar'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')

function MyApp(props: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;
  const { Component, pageProps } = props;

  React.useEffect(requireAuthentication(currentPath), []);

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
