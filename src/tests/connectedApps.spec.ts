// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { SCOPE_LABELS } from '../utils/oauthAuthorize';

const CATALOG = [{ id: 'c1', name: 'Apps', apps: [{ label: 'Spellcast', url: 'https://spellcast.nhexa.cl', icon: '' }] }];
const CONNECTED = [
  { clientId: 'dyn_claude', name: 'Claude', logoUri: null, verified: false, scopes: ['profile', 'streamby:read'], authorizedAt: '2026-10-27T10:00:00Z', lastUsedAt: '2026-10-27T11:00:00Z' },
  { clientId: 'streamby', name: 'StreamBy', logoUri: null, verified: true, scopes: ['email'], authorizedAt: '2026-10-20T10:00:00Z', lastUsedAt: null },
];

// What each source answers, per test: its data, or null (it couldn't be read).
let catalog: typeof CATALOG | null = CATALOG;
let connected: typeof CONNECTED | null = CONNECTED;
const removeAccountApp = vi.fn(async (_clientId: string) => true);
vi.mock('../middlewares/services', () => ({
  getNhexaEnv: vi.fn(async () => catalog),
  getConnectedApps: vi.fn(async () => connected),
  removeAccountApp: (clientId: string) => removeAccountApp(clientId),
}));

const { default: ConnectedApps } = await import('../app/components/ConnectedApps/ConnectedApps.component.vue');

const mountApps = async () => {
  const wrapper = mount(ConnectedApps, { global: { stubs: { 'font-awesome-icon': true, teleport: true } } });
  await flushPromises();
  return wrapper;
};
type Wrapper = Awaited<ReturnType<typeof mountApps>>;
const has = (wrapper: Wrapper, testId: string) => wrapper.find(`[data-testid="${testId}"]`).exists();

describe('the Applications section', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    catalog = CATALOG;
    connected = CONNECTED;
    removeAccountApp.mockClear();
  });

  it("lists Nhexa's apps, and the connected ones with what the user approved, in the consent screen's words", async () => {
    const wrapper = await mountApps();
    expect(wrapper.findAll('[data-testid="nhexa-app"]').map(a => a.text())).toEqual(['Spellcast']);
    const apps = wrapper.findAll('[data-testid="connected-app"]');
    expect(apps).toHaveLength(2);
    expect(apps[0].text()).toContain('Claude');
    expect(apps[0].text()).toContain('No verificada');
    expect(apps[0].text()).toContain(SCOPE_LABELS['streamby:read']);
    expect(apps[0].text()).toContain('Último uso');
    expect(apps[1].text()).not.toContain('No verificada');
    expect(apps[1].text()).not.toContain('Último uso');
  });

  it("still shows the connected apps when Nhexa's catalog can't be read", async () => {
    catalog = null;
    const wrapper = await mountApps();
    expect(has(wrapper, 'nhexa-apps-error')).toBe(true);
    expect(has(wrapper, 'nhexa-app')).toBe(false);
    expect(wrapper.findAll('[data-testid="connected-app"]')).toHaveLength(2);
    expect(has(wrapper, 'connected-apps-error')).toBe(false);
  });

  it("still shows Nhexa's catalog when the connected apps can't be read", async () => {
    connected = null;
    const wrapper = await mountApps();
    expect(has(wrapper, 'connected-apps-error')).toBe(true);
    expect(has(wrapper, 'connected-app')).toBe(false);
    expect(has(wrapper, 'connected-apps-empty')).toBe(false);
    expect(wrapper.findAll('[data-testid="nhexa-app"]')).toHaveLength(1);
    expect(has(wrapper, 'nhexa-apps-error')).toBe(false);
  });

  it('says so, briefly, when the user has connected no app', async () => {
    connected = [];
    const wrapper = await mountApps();
    expect(wrapper.find('[data-testid="connected-apps-empty"]').text()).toBe('No has conectado aplicaciones con tu cuenta de Nhexa.');
    expect(has(wrapper, 'connected-apps-error')).toBe(false);
  });

  it("takes an app's access away only once the user confirms", async () => {
    const wrapper = await mountApps();
    await wrapper.findAll('[data-testid="remove-app"]')[0].trigger('click');
    expect(removeAccountApp).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Claude dejará de poder acceder a tu cuenta de inmediato');

    await wrapper.find('.modal-btn--cancel').trigger('click');
    expect(removeAccountApp).not.toHaveBeenCalled();
    expect(wrapper.findAll('[data-testid="connected-app"]')).toHaveLength(2);

    await wrapper.findAll('[data-testid="remove-app"]')[0].trigger('click');
    await wrapper.findAll('.modal-footer button').find(b => b.text() === 'Quitar acceso')!.trigger('click');
    await flushPromises();
    expect(removeAccountApp).toHaveBeenCalledWith('dyn_claude');
    const left = wrapper.findAll('[data-testid="connected-app"]');
    expect(left).toHaveLength(1);
    expect(left[0].text()).toContain('StreamBy');
  });
});
