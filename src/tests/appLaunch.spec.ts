// @vitest-environment happy-dom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AppLaunch from '../app/components/AppMenu/AppLaunch.component.vue';
import { splashOf } from '../app/components/AppMenu/appLaunch';

const stubMotion = (reduce: boolean) => vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
  matches: reduce && query.includes('reduce'), media: query, onchange: null,
  addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
})));

describe("launching an app from the desktop", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it("knows the splashes it can fade into, by the app's name, and no other", () => {
    expect(splashOf('Spellcast')).toBe('spellcast');
    expect(splashOf('SPECTRA')).toBe('spectra');
    expect(splashOf('StreamBy')).toBe('streamby');
    expect(splashOf('Nhexa')).toBeNull();
  });

  it("draws only the app's splash background, no logo (its own splash draws it), and is done once it's all undone", () => {
    vi.useFakeTimers();
    stubMotion(false);
    // Its drawing is the browser's canvas (not this one's): here it only has to be done in the end.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const wrapper = mount(AppLaunch, { props: { kind: 'spectra', from: { x: 10, y: 20 } }, attachTo: document.body });
    const launch = document.querySelector('[data-testid="app-launch"]');
    expect(launch?.getAttribute('data-kind')).toBe('spectra');
    expect(launch?.querySelectorAll('canvas')).toHaveLength(2);
    expect(launch?.querySelector('img')).toBeNull();
    expect(wrapper.emitted('done')).toBeUndefined();
    vi.advanceTimersByTime(2000);
    expect(wrapper.emitted('done')).toHaveLength(1);
    wrapper.unmount();
  });

  it('is done at once without motion', () => {
    stubMotion(true);
    const wrapper = mount(AppLaunch, { props: { kind: 'streamby', from: { x: 0, y: 0 } }, attachTo: document.body });
    expect(wrapper.emitted('done')).toHaveLength(1);
    wrapper.unmount();
  });
});
