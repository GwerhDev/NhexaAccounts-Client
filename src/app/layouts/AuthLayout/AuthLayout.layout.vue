<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Logo from '../../components/Logo/Logo.component.vue';
import LogoHeader from '../../components/Logo/LogoHeader.component.vue';

const route = useRoute();
// The big logo, unless the page shows Nhexa's next to an app's (then a small one, as a header).
const compactLogo = computed(() => {
  const compact = route.meta.compactLogo;
  return typeof compact === 'function' ? compact(route) : !!compact;
});
</script>

<template>
  <!-- Signing in, signing up and authorizing an app: only the task at hand, centered. -->
  <div class="auth-layout" data-testid="auth-layout">
    <div class="auth-content mw-460">
      <header class="auth-header">
        <Logo v-if="compactLogo" width="40" data-testid="auth-logo-compact" />
        <LogoHeader v-else :size="110" data-testid="auth-logo" />
      </header>
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss" src="./AuthLayout.layout.scss" />
