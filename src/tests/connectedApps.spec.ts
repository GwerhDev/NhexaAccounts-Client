// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { SCOPE_LABELS } from '../utils/oauthAuthorize';

const removeAccountApp = vi.fn(async (_clientId: string) => true);
vi.mock('../middlewares/services', () => ({
  getAccountApps: vi.fn(async () => ({
    nhexa: [{ id: 'c1', name: 'Apps', apps: [{ label: 'Spellcast', url: 'https://spellcast.nhexa.cl' }] }],
    connected: [
      { clientId: 'dyn_claude', name: 'Claude', logoUri: null, verified: false, scopes: ['profile', 'streamby:read'], authorizedAt: '2026-10-27T10:00:00Z', lastUsedAt: '2026-10-27T11:00:00Z' },
      { clientId: 'streamby', name: 'StreamBy', logoUri: null, verified: true, scopes: ['email'], authorizedAt: '2026-10-20T10:00:00Z', lastUsedAt: null },
    ],
  })),
  removeAccountApp: (clientId: string) => removeAccountApp(clientId),
}));

const { default: ConnectedApps } = await import('../app/components/ConnectedApps/ConnectedApps.component.vue');

const mountApps = async () => {
  const wrapper = mount(ConnectedApps, { global: { stubs: { 'font-awesome-icon': true, teleport: true } } });
  await flushPromises();
  return wrapper;
};

describe('the Applications section', () => {
  beforeEach(() => { setActivePinia(createPinia()); removeAccountApp.mockClear(); });

  it("lists Nhexa's apps, and the connected ones with what the user approved, in the consent screen's words", async () => {
    const wrapper = await mountApps();
    expect(wrapper.find('[data-testid="nhexa-apps"]').text()).toContain('Spellcast');
    const apps = wrapper.findAll('[data-testid="connected-app"]');
    expect(apps).toHaveLength(2);
    expect(apps[0].text()).toContain('Claude');
    expect(apps[0].text()).toContain('No verificada');
    expect(apps[0].text()).toContain(SCOPE_LABELS['streamby:read']);
    expect(apps[0].text()).toContain('Último uso');
    expect(apps[1].text()).not.toContain('No verificada');
    expect(apps[1].text()).not.toContain('Último uso');
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
    const confirm = wrapper.findAll('.modal-footer button').find(b => b.text() === 'Quitar acceso')!;
    await confirm.trigger('click');
    await flushPromises();
    expect(removeAccountApp).toHaveBeenCalledWith('dyn_claude');
    const left = wrapper.findAll('[data-testid="connected-app"]');
    expect(left).toHaveLength(1);
    expect(left[0].text()).toContain('StreamBy');
  });
});
