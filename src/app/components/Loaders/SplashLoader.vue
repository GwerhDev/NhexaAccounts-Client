<script setup lang="ts">
import LogoHeaderComponent from '../Logo/LogoHeader.component.vue';

// A phone (the layouts' breakpoint): a smaller logo. Read once, the splash only shows a moment.
const logoSize = window.matchMedia('(max-width: 1080px)').matches ? 110 : 200;
</script>

<template>
  <div class="splash-container">
    <LogoHeaderComponent :size="logoSize" />
    <div class="splash-bar-track">
      <div class="splash-bar" />
    </div>
  </div>
</template>

<style scoped lang="scss" src="./SplashLoader.scss"></style>