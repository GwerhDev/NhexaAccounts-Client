<script setup lang="ts">
import Logo from '../../components/Logo/Logo.component.vue';
</script>

<template>
  <!-- Signing in, signing up and authorizing an app: only the task at hand, centered. -->
  <div class="auth-layout" data-testid="auth-layout">
    <div class="auth-content mw-460">
      <header class="auth-header">
        <Logo width="40" />
      </header>
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss" src="./AuthLayout.layout.scss" />
