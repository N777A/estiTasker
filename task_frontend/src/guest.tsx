import axios from 'axios'
import { setCookie } from 'nookies'

const guestLogin = async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/guest_sign_in`, {})
    console.log()
    setCookie(null, "uid", response.headers["uid"], {
      path: "/",
    });
    setCookie(null, "client", response.headers["client"], {
      path: "/",
    });
    setCookie(null, "access-token", response.headers["access-token"], {
      path: "/",
    });
    return true;
  } catch (error) {
    console.error('ログインに失敗しました', error);
    return false;
  }
}
export default guestLogin;
