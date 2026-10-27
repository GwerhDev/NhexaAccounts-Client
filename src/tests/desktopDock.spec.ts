// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DesktopDock from '../app/components/AppMenu/DesktopDock.component.vue';

const originalLocation = window.location;
const watchNavigation = () => {
  const location = { href: 'https://accounts.nhexa.cl/' };
  Object.defineProperty(window, 'location', { configurable: true, value: location });
  return location;
};

const mountDock = () => mount(DesktopDock, { global: { stubs: { 'font-awesome-icon': true } } });

describe("the desktop's dock", () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it("goes to Nhexa's home", async () => {
    const location = watchNavigation();
    const wrapper = mountDock();
    await wrapper.find('[data-testid="dock-home"]').trigger('click');
    expect(location.href).toBe('https://nhexa.cl');
    expect(wrapper.emitted('close')).toBeUndefined();
  });

  it('closes the desktop for the account, since this is it', async () => {
    const location = watchNavigation();
    const wrapper = mountDock();
    const account = wrapper.find('[data-testid="dock-account"]');
    expect(account.classes()).toContain('current');
    await account.trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(location.href).toBe('https://accounts.nhexa.cl/');
  });

  it("shows the settings, but they can't be opened yet", () => {
    const settings = mountDock().find('[data-testid="dock-settings"]');
    expect(settings.exists()).toBe(true);
    expect(settings.attributes('disabled')).toBeDefined();
  });
});
