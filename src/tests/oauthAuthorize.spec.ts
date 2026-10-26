import { describe, it, expect } from 'vitest';
import { authorizeQuery, failureMessage, loginLocation, nextAuthorizeStep, scopeLabel } from '../utils/oauthAuthorize';
import type { OAuthAuthorizeRequest } from '../middlewares/services';

const REQUEST: OAuthAuthorizeRequest = {
  client: { id: 'streamby', name: 'StreamBy', logoUri: null, clientUri: null, verified: true },
  scopes: ['profile', 'streamby:read'],
  redirectUri: 'https://streamby.nhexa.cl/oauth/callback',
  consented: false,
};

describe('the next step of an authorization request', () => {
  it('sends an invalid request back to the app when Nhexa says where', () => {
    const redirectTo = 'https://streamby.nhexa.cl/oauth/callback?error=invalid_scope&state=x';
    expect(nextAuthorizeStep({ error: 'invalid_scope', redirectTo }, true)).toEqual({ kind: 'redirect', to: redirectTo });
  });

  it("only shows an error when the app can't be trusted with it (unknown client, unregistered redirect)", () => {
    expect(nextAuthorizeStep({ error: 'invalid_request', error_description: 'Unknown client' }, true))
      .toEqual({ kind: 'error', message: failureMessage({ error: 'invalid_request' }) });
    expect(nextAuthorizeStep({ error: 'server_error' }, false).kind).toBe('error');
  });

  it("tells the user what went wrong in their words, not in the app developer's", () => {
    expect(failureMessage({ error: 'invalid_request', error_description: 'Unknown client' })).not.toContain('Unknown client');
    expect(failureMessage({ error: 'temporarily_unavailable' })).not.toBe(failureMessage({ error: 'something_else' }));
  });

  it('asks a signed-out user to sign in first', () => {
    expect(nextAuthorizeStep(REQUEST, false)).toEqual({ kind: 'login' });
  });

  it('asks a signed-in user to approve it, unless they already did for those scopes', () => {
    expect(nextAuthorizeStep(REQUEST, true)).toEqual({ kind: 'consent', request: REQUEST });
    expect(nextAuthorizeStep({ ...REQUEST, consented: true }, true)).toEqual({ kind: 'approve' });
  });
});

describe('the authorization request parameters', () => {
  it('keeps those given once, and leaves out a repeated one', () => {
    expect(authorizeQuery({ client_id: 'streamby', scope: 'profile', state: ['a', 'b'], empty: null }))
      .toEqual({ client_id: 'streamby', scope: 'profile' });
  });
});

describe('signing in for an authorization request', () => {
  it('comes back to the same request', () => {
    const url = 'https://accounts.nhexa.cl/oauth/authorize?client_id=streamby&state=a%26b';
    const location = loginLocation(url);
    expect(new URL(location, 'https://accounts.nhexa.cl').searchParams.get('callback')).toBe(url);
  });
});

describe('scope labels', () => {
  it('describe each scope Nhexa offers, and show an unknown one as is', () => {
    for (const scope of ['profile', 'email', 'streamby:read', 'streamby:write']) expect(scopeLabel(scope)).not.toBe(scope);
    expect(scopeLabel('other')).toBe('other');
  });
});
