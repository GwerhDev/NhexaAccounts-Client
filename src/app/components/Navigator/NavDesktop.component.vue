<style scoped lang="scss" src="./NavDesktop.component.scss" />
<script setup lang="ts">
import AccMenu from '../AccMenu/AccMenu.vue';
import AppMenu from '../AppMenu/AppMenu.vue';
import Logo from '../Logo/Logo.component.vue';

</script>

<template>
  <nav class="nav-desk-container">
    <div class="d-flex align-cent logo-container">
      <div class="d-flex align-cent logo-cont">
        <Logo />
      </div>

      <div class="user-button">
        <AppMenu />
        <AccMenu />
      </div>
    </div>
  </nav>
</template>