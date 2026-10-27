import type { OAuthAuthorizeRequest, OAuthFailure } from '../middlewares/services';

// What /oauth/authorize does with an app's authorization request, once Nhexa checked it:
// a request Nhexa can't trust goes back to the app as an error when it may (a known client,
// a registered redirect URI), else it's only shown here; a valid one asks the user to sign in,
// then to approve it -- unless they already approved those scopes for that app.

export type AuthorizeStep =
  | { kind: 'redirect'; to: string }
  | { kind: 'error'; message: string }
  | { kind: 'login' }
  | { kind: 'approve' }
  | { kind: 'consent'; request: OAuthAuthorizeRequest };

/** What the user is told each scope lets the app do. */
export const SCOPE_LABELS: Record<string, string> = {
  profile: 'Ver tu nombre de usuario y foto de perfil',
  email: 'Ver tu correo electrónico',
  'streamby:read': 'Ver tus proyectos, archivos y documentos de StreamBy',
  'streamby:write': 'Crear y modificar tus proyectos, archivos y documentos de StreamBy',
};

export const scopeLabel = (scope: string): string => SCOPE_LABELS[scope] ?? scope;

/** The request's parameters: only those given once (a repeated one is left for Nhexa to turn down). */
export const authorizeQuery = (query: Record<string, unknown>): Record<string, string> =>
  Object.fromEntries(Object.entries(query).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));

// What the user is told when a request can't go on (Nhexa's descriptions are for the app's developers).
const FAILURE_MESSAGES: Record<string, string> = {
  invalid_request: 'La aplicación que te trajo aquí envió una solicitud que Nhexa no reconoce.',
  access_denied: 'Esta solicitud no puede autorizarse desde aquí.',
  login_required: 'Tu sesión expiró antes de que respondieras.',
  temporarily_unavailable: 'La autorización de aplicaciones no está disponible en este momento.',
};

/** The message shown for a failed request. */
export const failureMessage = (failure: OAuthFailure): string =>
  FAILURE_MESSAGES[failure.error] ?? 'Ocurrió un error al procesar la solicitud de autorización.';

const isFailure = (response: OAuthAuthorizeRequest | OAuthFailure): response is OAuthFailure => 'error' in response;

export const nextAuthorizeStep = (response: OAuthAuthorizeRequest | OAuthFailure, logged: boolean): AuthorizeStep => {
  if (isFailure(response)) {
    if (response.redirectTo) return { kind: 'redirect', to: response.redirectTo };
    return { kind: 'error', message: failureMessage(response) };
  }
  if (!logged) return { kind: 'login' };
  if (response.consented) return { kind: 'approve' };
  return { kind: 'consent', request: response };
};

/** The login page, set to come back to this same authorization request. */
export const loginLocation = (authorizeUrl: string): string => `/login?callback=${encodeURIComponent(authorizeUrl)}`;
