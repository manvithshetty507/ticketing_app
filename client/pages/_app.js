// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './../styles/global.css';
import { createAxiosClient } from '../axios/axios-client';
import { createContext } from 'react';

export const AuthContext = createContext();

export default function App({ Component, pageProps, currentUser }) {
  console.log('currentUser:', currentUser);
  return (
    <AuthContext.Provider value={{ currentUser }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

App.getInitialProps = async (appContext) => {
  const client = createAxiosClient(appContext.ctx.req);
  let currentUser = null;

  try {
    const response = await client.get('/api/users/currentuser');
    currentUser = response.data.currentUser;
  } catch (err) {
    console.error('Error fetching current user:', err);
  }

  // Call the page’s own getInitialProps if it exists
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, currentUser };
};
