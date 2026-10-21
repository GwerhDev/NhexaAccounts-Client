import { ACCOUNTS_URL, ALLOWED_ORIGINS, CLIENT_URL, STREAMBY_URL } from '../middlewares/misc/const';

// Where a login (or a signup) may send the user back to once it's done: only Nhexa's own
// sites (https://nhexa.cl and its subdomains) and this deployment's own apps (its client,
// StreamBy and accounts URLs, and the apps registered in VITE_ALLOWED_ORIGINS -- the same
// list as Nhexa-API's ALLOWED_ORIGINS, e.g. each app on localhost while developing). Anything else -- another site, a relative path, a javascript:
// URL -- is never followed: it would hand the user, signed in, to whoever wrote the link.

const NHEXA_DOMAIN = 'nhexa.cl';

const originOf = (url: string | undefined): string[] => {
  try {
    return url ? [new URL(url).origin] : [];
  } catch {
    return [];
  }
};

/** The origins in a list like ALLOWED_ORIGINS ("['https://a', 'https://b']" or "https://a,https://b"). */
export const parseOrigins = (raw: string | undefined): string[] =>
  (raw ?? '').replace(/[[\]'"\s]/g, '').split(',').flatMap(originOf);

const REGISTERED = [...[ACCOUNTS_URL, CLIENT_URL, STREAMBY_URL].flatMap(originOf), ...parseOrigins(ALLOWED_ORIGINS)];

/** Whether a login may send the user to `target`: a full URL on Nhexa's sites (https) or one
 * of this deployment's apps. */
export const isAllowedCallback = (target: unknown, registered: string[] = REGISTERED): target is string => {
  if (typeof target !== 'string' || !target) return false;
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return false;
  }
  if (url.username || url.password) return false;
  if (registered.includes(url.origin)) return true;
  const host = url.hostname.toLowerCase();
  return url.protocol === 'https:' && (host === NHEXA_DOMAIN || host.endsWith(`.${NHEXA_DOMAIN}`));
};

/** `target` if a login may send the user there, else '' (none: they stay here). */
export const allowedCallback = (target: unknown): string => (isAllowedCallback(target) ? target : '');
