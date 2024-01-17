import * as React from 'react';
import  { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { setCookie, destroyCookie } from 'nookies';
import router from 'next/router';
import { Alert } from '@mui/material';
import apiClient from '../../apiClient'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        estiTasker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    (async () => {
      setIsError(false);
      setErrorMessage("");
      try {
        const response = await apiClient.post("auth", {
          name: data.get('name'),
          email: data.get('email'),
          password: data.get('password'),
          password_confirmation: data.get('password_confirmation'),
        });
        setCookie(null, 'uid', response.headers["uid"], {
          path: "/",
        });
        setCookie(null, 'client', response.headers["client"], {
          path: "/",
        });
        setCookie(null, 'access-token', response.headers["access-token"], {
          path: "/",
        });
        router.push('../projects');
      } catch (err) {
        destroyCookie(null, 'uid');
        destroyCookie(null, 'client');
        destroyCookie(null, 'access-token');
        setIsError(true);
        setErrorMessage("エラーが発生しました。")
      }
    })();
  };

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
            新規登録
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="名前"
                  type="text"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label="パスワード"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password_confirmation"
                  label="確認用パスワード"
                  type="password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              新規登録
            </Button>
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="../sign_in" variant="body2">
                  すでにアカウントを作成している場合はこちら
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
