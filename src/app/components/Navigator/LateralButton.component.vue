<style scoped lang="scss" src="./LateralButton.component.scss" />
<script setup lang="ts">
import { openMenu, closeMenu } from '../../../helpers/menu';

</script>

<template>
  <div class="burger-menu-container">
    <img src="../../../assets/svg/icon-burger-menu.svg" @click="openMenu()" alt="">
  </div>
  <div class="close-menu-container" alt="">
    <img src="../../../assets/svg/close-icon.svg" @click="closeMenu()" width="25" alt="">
  </div>
</template>