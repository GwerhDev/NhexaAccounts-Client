import { describe, it, expect, vi, afterEach } from 'vitest';
import { allowedCallback, isAllowedCallback, parseOrigins } from '../utils/allowedCallback';

const REGISTERED = ['http://localhost:5174', 'https://streamby.example.com'];

describe('isAllowedCallback', () => {
  it("lets a login go back to Nhexa's own sites, over https", () => {
    for (const target of ['https://nhexa.cl', 'https://accounts.nhexa.cl/', 'https://streamby.nhexa.cl/projects?x=1']) {
      expect(isAllowedCallback(target, REGISTERED)).toBe(true);
    }
  });

  it("lets a login go back to this deployment's apps, exactly", () => {
    expect(isAllowedCallback('http://localhost:5174/somewhere', REGISTERED)).toBe(true);
    expect(isAllowedCallback('https://streamby.example.com/x', REGISTERED)).toBe(true);
    expect(isAllowedCallback('http://localhost:6666', REGISTERED)).toBe(false);
    expect(isAllowedCallback('http://streamby.example.com', REGISTERED)).toBe(false);
  });

  it('turns down any other site, however it is dressed up', () => {
    for (const target of [
      'https://evil.example.com',
      'https://nhexa.cl.evil.example.com',
      'https://evilnhexa.cl',
      'http://accounts.nhexa.cl',
      'https://accounts.nhexa.cl@evil.example.com',
      'https://user:pass@accounts.nhexa.cl',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      '//evil.example.com',
      '/relative/path',
      '',
    ]) {
      expect(isAllowedCallback(target, REGISTERED), target).toBe(false);
    }
  });

  it("turns down what isn't a single string (a repeated query parameter)", () => {
    expect(isAllowedCallback(undefined, REGISTERED)).toBe(false);
    expect(isAllowedCallback(['https://accounts.nhexa.cl'], REGISTERED)).toBe(false);
  });
});

describe('allowedCallback', () => {
  it('keeps an allowed destination, and drops any other (the user stays in accounts)', () => {
    expect(allowedCallback('https://accounts.nhexa.cl/x')).toBe('https://accounts.nhexa.cl/x');
    expect(allowedCallback('https://evil.example.com')).toBe('');
    expect(allowedCallback('javascript:alert(1)')).toBe('');
  });
});

describe('parseOrigins', () => {
  // The same list as Nhexa-API's ALLOWED_ORIGINS, written either way.
  it('reads a list written as an array or comma-separated, keeping only valid origins', () => {
    expect(parseOrigins("['http://localhost:5175', 'https://spellcast.example.com/']")).toEqual(['http://localhost:5175', 'https://spellcast.example.com']);
    expect(parseOrigins('http://localhost:5175,http://localhost:5176')).toEqual(['http://localhost:5175', 'http://localhost:5176']);
    expect(parseOrigins('not a url,')).toEqual([]);
    expect(parseOrigins(undefined)).toEqual([]);
  });

  it('lets a login go back to an app on that list (e.g. Spellcast on localhost)', () => {
    expect(isAllowedCallback('http://localhost:5175/', parseOrigins("['http://localhost:5175']"))).toBe(true);
  });
});

describe('the apps registered with this deployment', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

  it('a login goes back to an app in VITE_ALLOWED_ORIGINS, and not to one outside it', async () => {
    vi.stubEnv('VITE_ALLOWED_ORIGINS', "['http://localhost:5175']");
    vi.resetModules();
    const fresh = await import('../utils/allowedCallback');
    expect(fresh.allowedCallback('http://localhost:5175/')).toBe('http://localhost:5175/');
    expect(fresh.allowedCallback('http://localhost:6666/')).toBe('');
  });
});
