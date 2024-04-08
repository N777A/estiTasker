import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { setCookie, destroyCookie } from "nookies";
import router from 'next/router';
import apiClient from '../../apiClient'
import axios from 'axios';
import { Alert, Link } from '@mui/material';
import guestLogin from '@/src/guest';

const defaultTheme = createTheme();

export default function SignIn() {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    (async () => {
      setIsError(false);
      setErrorMessage("");
      try {
        const response = await apiClient.post("auth/sign_in", {
          email: data.get("email"),
          password: data.get("password"),
        });
        setCookie(null, "uid", response.headers["uid"], {
          path: "/",
        });
        setCookie(null, "client", response.headers["client"], {
          path: "/",
        });
        setCookie(null, "access-token", response.headers["access-token"], {
          path: "/",
        });
        router.push("/projects");
      } catch (err) {
        destroyCookie(null, "uid");
        destroyCookie(null, "client");
        destroyCookie(null, "access-token");
        setIsError(true);
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.status === 401) {
            setErrorMessage('Email又はパスワードが間違えています。')
          } else {
            setErrorMessage("エラーが発生しました。");
          }
        }
      }
    })();
  };
  const handleGuestLogin = async () => {
    const success = await guestLogin();
    if (success) {
      router.push("/projects");
    } else {
      console.error('Guest login failed')
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="ログイン状態を保存する"
            />
            {isError ? (
              <Alert
                onClose={() => {
                  setIsError(false);
                  setErrorMessage("");
                }}
                severity='error'
                >
                  {errorMessage}
                </Alert>
            ): null}
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>
          </Box>
        </Box>
        <Link href="../sign_up" variant="body2">
          {"新規登録はこちら"}
        </Link>
        <Button 
          onClick={handleGuestLogin}
        >
          ゲストとしてログインはこちら
        </Button>
      </Container>
    </ThemeProvider>
  );
}
