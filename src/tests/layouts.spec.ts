// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://accounts.nhexa.cl/" }
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';

// The session the API answers with, per test.
let session: { logged: boolean; userData?: Record<string, unknown> } = { logged: false };

// No request leaves the test: every service answers empty, and the account ones with `session`.
vi.mock('../middlewares/services', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>();
  const mocked: Record<string, unknown> = Object.fromEntries(Object.keys(actual).map(name => [name, vi.fn(async () => [])]));
  mocked.getUserData = vi.fn(async () => session);
  mocked.getUserOverview = vi.fn(async () => ({
    securityStatus: { passwordSetAt: null, twoFactorEnabled: false },
    userData: session.userData,
    accountDetail: { firstName: null, lastName: null, birthDate: null, countryId: null, phone: null, phoneCode: null, passwordSetAt: null },
  }));
  return mocked;
});
// The navigation's own pieces fetch and register menus: plain elements stand in for them.
vi.mock('../app/components/Navigator/NavBar.component.vue', () => ({ default: defineComponent({ render: () => h('nav') }) }));
vi.mock('../app/components/Navigator/LateralBar.component.vue', () => ({ default: defineComponent({ render: () => h('aside') }) }));

const { default: App } = await import('../App.vue');
const { default: router } = await import('../app/routes');

const USER = { id: 'ada', username: 'ada', email: 'ada@nhexa.cl', role: 'user', isVerified: true, profilePic: null };

const mountAt = async (path: string, logged: boolean) => {
  session = logged ? { logged: true, userData: USER } : { logged: false };
  await router.push(path);
  const wrapper = mount(App, { global: { plugins: [createPinia(), router], stubs: { 'font-awesome-icon': true } } });
  await flushPromises();
  await router.isReady();
  await flushPromises();
  return wrapper;
};

const has = (wrapper: Awaited<ReturnType<typeof mountAt>>, testId: string) => wrapper.find(`[data-testid="${testId}"]`).exists();

describe('layouts', () => {
  beforeEach(() => { session = { logged: false }; });

  it('an authentication page is shown alone: no navigation bar, no side menu', async () => {
    for (const path of ['/login', '/register', '/oauth/authorize?client_id=x']) {
      const wrapper = await mountAt(path, false);
      expect(has(wrapper, 'auth-layout'), path).toBe(true);
      expect(has(wrapper, 'nav-bar'), path).toBe(false);
      expect(has(wrapper, 'lateral-bar'), path).toBe(false);
      wrapper.unmount();
    }
  });

  it('an account page is shown with the navigation bar and the side menu', async () => {
    for (const path of ['/', '/personal-info']) {
      const wrapper = await mountAt(path, true);
      expect(router.currentRoute.value.path, path).toBe(path);
      expect(has(wrapper, 'default-layout'), path).toBe(true);
      expect(has(wrapper, 'nav-bar'), path).toBe(true);
      expect(has(wrapper, 'lateral-bar'), path).toBe(true);
      expect(has(wrapper, 'auth-layout'), path).toBe(false);
      wrapper.unmount();
    }
  });
});

describe('where the login says it goes back to', () => {
  const noticeAt = async (path: string) => {
    const wrapper = await mountAt(path, false);
    const notice = wrapper.find('[data-testid="callback-notice"]');
    const text = notice.exists() ? notice.text() : null;
    wrapper.unmount();
    return text;
  };

  it('back to authorizing the app, for an OAuth request of accounts itself', async () => {
    const authorize = 'https://accounts.nhexa.cl/oauth/authorize?client_id=streamby&scope=profile%20email&state=a%26b';
    expect(await noticeAt(`/login?callback=${encodeURIComponent(authorize)}`)).toBe('Al iniciar sesión, volverás a autorizar la aplicación');
  });

  it("only the site's host, for any other destination", async () => {
    const other = 'https://streamby.nhexa.cl/projects/42?tab=assets&sort=desc';
    expect(await noticeAt(`/login?callback=${encodeURIComponent(other)}`)).toBe('Al iniciar sesión, se te redireccionará a: streamby.nhexa.cl');
  });

  it('nothing, without a callback (or with one the login would never follow)', async () => {
    expect(await noticeAt('/login')).toBeNull();
    expect(await noticeAt(`/login?callback=${encodeURIComponent('https://evil.example.com/x')}`)).toBeNull();
  });
});
