// What the login tells the user about where they'll go once signed in. Only the site's host is
// shown: a callback can be a long URL (an OAuth request carries its whole query). Coming back
// to this app's own authorization page means going on to approve the app that asked.

const OAUTH_AUTHORIZE_PATH = '/oauth/authorize';

/** The notice for `callback`, or '' when there's none to show. */
export const callbackNotice = (callback: string, ownOrigin: string = window.location.origin): string => {
  if (!callback) return '';
  let url: URL;
  try {
    url = new URL(callback);
  } catch {
    return '';
  }
  if (url.origin === ownOrigin && url.pathname === OAUTH_AUTHORIZE_PATH) {
    return 'Al iniciar sesión, volverás a autorizar la aplicación';
  }
  return `Al iniciar sesión, se te redireccionará a: ${url.host}`;
};
