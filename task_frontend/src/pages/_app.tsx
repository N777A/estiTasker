import * as React from "react";
import { AppProps } from "next/app";
import PropTypes from "prop-types";
import { requireAuthentication } from "../auth";
import { useRouter } from "next/router";
import Navbar from '../components/common/Navbar'

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
