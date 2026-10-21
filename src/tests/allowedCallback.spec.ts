import { describe, it, expect } from 'vitest';
import { allowedCallback, isAllowedCallback } from '../utils/allowedCallback';

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
