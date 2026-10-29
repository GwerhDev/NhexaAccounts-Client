// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UserAvatar from '../app/components/UserAvatar/UserAvatar.component.vue';

describe('UserAvatar', () => {
  it('shows the photo when there is one', () => {
    const wrapper = mount(UserAvatar, { props: { src: 'https://example.com/me.png', name: 'Nhexa' } });
    expect(wrapper.find('[data-testid="user-avatar-photo"]').attributes('src')).toBe('https://example.com/me.png');
    expect(wrapper.find('[data-testid="user-avatar-initials"]').exists()).toBe(false);
  });

  it('shows the initials of the first two words without a photo', () => {
    expect(mount(UserAvatar, { props: { name: 'juan pérez soto' } }).text()).toBe('JP');
    expect(mount(UserAvatar, { props: { name: 'Nhexa' } }).text()).toBe('N');
    expect(mount(UserAvatar, { props: { name: '' } }).text()).toBe('?');
  });

  it('falls back to the initials when the photo fails to load', async () => {
    const wrapper = mount(UserAvatar, { props: { src: 'https://example.com/broken.png', name: 'Nhexa' } });
    await wrapper.find('img').trigger('error');
    expect(wrapper.find('[data-testid="user-avatar-initials"]').text()).toBe('N');
  });
});
