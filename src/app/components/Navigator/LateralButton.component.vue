<style scoped lang="scss" src="./LateralButton.component.scss" />
<script setup lang="ts">
import { openMenu, closeMenu } from '../../../helpers/menu';
import closeIcon from '../../../assets/svg/close-icon.svg';
import burgerIcon from '../../../assets/svg/icon-burger-menu.svg';

</script>

<template>
  <div class="burger-menu-container">
    <img :src="burgerIcon" @click="openMenu()" alt="">
  </div>
  <div class="close-menu-container" alt="">
    <img :src="closeIcon" @click="closeMenu()" width="25" alt="">
  </div>
</template>