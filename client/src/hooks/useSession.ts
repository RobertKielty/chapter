import { useAuth0 } from '@auth0/auth0-react';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// TODO: figure out how to create a proper separation between auth0 and the dev
// login.  How about creating two providers and conditionally wrapping the rest
// of the site in one or the other?
const needsDevLogin = process.env.NEXT_PUBLIC_USE_AUTH0 === 'false';

const requestSession = (token: string) =>
  fetch(new URL('/login', serverUrl).href, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

const destroySession = () =>
  fetch(new URL('/logout', serverUrl).href, {
    method: 'DELETE',
    credentials: 'include',
  });

const useAuth0Session = (): {
  isAuthenticated: boolean;
  createSession: () => Promise<Response>;
  destroySession: () => Promise<Response>;
} => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const createSession = async () => {
    const token = await getAccessTokenSilently();
    return requestSession(token);
  };

  return {
    isAuthenticated,
    createSession,
    destroySession,
  };
};

export const useDevSession = (): {
  isAuthenticated: boolean;
  createSession: () => Promise<Response>;
  destroySession: () => Promise<Response>;
} => {
  const createSession = async () => await requestSession('fake-token');

  // Unlike the Auth0 login, the dev login creates the session immediately when
  // you click the login button. Since `isAuthenticated` communicates that a
  // session can be created, we return false to stop the client from trying to
  // create a session on every page load.
  return {
    isAuthenticated: false,
    createSession,
    destroySession,
  };
};

export const useSession: () => {
  isAuthenticated: boolean;
  createSession: () => Promise<Response>;
  destroySession: () => Promise<Response>;
} = needsDevLogin ? useDevSession : useAuth0Session;
