<style scoped lang="scss" src="./NavBar.component.scss" />
<script setup lang="ts">
import NavDesktop from './NavDesktop.component.vue';
import NavMobile from './NavMobile.component.vue';
import AppMenu from '../AppMenu/AppMenu.component.vue';
import AccountMenu from '../AccountMenu/AccountMenu.component.vue';

</script>

<template>
  <nav class="nav-container">
    <NavDesktop />
    <NavMobile />
    <AccountMenu />
    <AppMenu />
  </nav>
</template>