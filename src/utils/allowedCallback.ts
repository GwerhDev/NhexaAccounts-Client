import { ACCOUNTS_URL, CLIENT_URL, STREAMBY_URL } from '../middlewares/misc/const';

// Where a login (or a signup) may send the user back to once it's done: only Nhexa's own
// sites (https://nhexa.cl and its subdomains) and this deployment's own apps (its client,
// StreamBy and accounts URLs). Anything else -- another site, a relative path, a javascript:
// URL -- is never followed: it would hand the user, signed in, to whoever wrote the link.

const NHEXA_DOMAIN = 'nhexa.cl';

const originOf = (url: string | undefined): string[] => {
  try {
    return url ? [new URL(url).origin] : [];
  } catch {
    return [];
  }
};

const REGISTERED = [ACCOUNTS_URL, CLIENT_URL, STREAMBY_URL].flatMap(originOf);

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
