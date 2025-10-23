<style scoped lang="scss" src="./NavMobile.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { openMenu, closeMenu } from '../../../helpers/menu';
import Logo from '../Logo/Logo.component.vue';
import MenuMobile from '../Menu/MenuMobile.component.vue';
import AppMenu from '../AppMenu/AppMenu.vue';
import AccMenu from '../AccMenu/AccMenu.vue';

const store: any = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);

</script>

<template>
  <ul class="nav-menu-ul">
    <div class="d-flex align-cent logo-container">
      <div class="d-flex align-cent logo-cont">
        <div class="burger-menu-container" v-if="logged">
          <font-awesome-icon class="icon" :icon="['fas', 'bars']" @click="openMenu()" alt="" />
        </div>
        <div class="close-menu-container" alt="">
          <font-awesome-icon class="icon" :icon="['fas', 'xmark']" @click="closeMenu()" alt="" />
        </div>
        <Logo :width="'40'" @click="closeMenu()" />
      </div>

      <div class="user-button">
        <AppMenu />
        <AccMenu />
      </div>
    </div>
    <div class="menu-mobile-container">
      <MenuMobile />
    </div>
  </ul>
</template>