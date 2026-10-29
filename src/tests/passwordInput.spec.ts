// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PasswordInput from '../app/components/PasswordInput/PasswordInput.component.vue';

const mountInput = (props: Record<string, unknown> = {}) =>
  mount(PasswordInput, { props: { modelValue: '', autocomplete: 'current-password', ...props } });

describe('PasswordInput', () => {
  it('hides what is typed until the eye is clicked', async () => {
    const wrapper = mountInput();
    expect(wrapper.find('input').attributes('type')).toBe('password');
    await wrapper.find('.reveal-btn').trigger('click');
    expect(wrapper.find('input').attributes('type')).toBe('text');
  });

  it('tells the password manager which password it is', () => {
    expect(mountInput({ autocomplete: 'new-password' }).find('input').attributes('autocomplete')).toBe('new-password');
  });

  it('emits what is typed', async () => {
    const wrapper = mountInput();
    await wrapper.find('input').setValue('secret123');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['secret123']);
  });

  it('can be disabled while it is saved', () => {
    const wrapper = mountInput({ disabled: true });
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.find('.reveal-btn').attributes('disabled')).toBeDefined();
  });
});
