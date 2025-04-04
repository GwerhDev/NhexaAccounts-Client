<style scoped lang="scss" src="./NavMobile.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { openMenu, closeMenu, openAccountMenu, openAppMenu } from '../../../helpers/menu';
import Logo from '../Logo/Logo.component.vue';
import MenuMobile from '../Menu/MenuMobile.component.vue';

const store: any = useStore();
const currentUser: any = computed(() => store.currentUser);

</script>

<template>
  <ul class="nav-menu-ul">
    <div class="d-flex align-cent logo-container">
      <div class="d-flex align-cent logo-cont">
        <div class="burger-menu-container">
          <font-awesome-icon class="icon" :icon="['fas', 'bars']" @click="openMenu()" alt="" />
        </div>
        <div class="close-menu-container" alt="">
          <font-awesome-icon class="icon" :icon="['fas', 'xmark']" @click="closeMenu()" alt="" />
        </div>
        <Logo :width="'40'"  @click="closeMenu()" />
      </div>

      <div class="user-button">
        <font-awesome-icon class="icon" :icon="['fas', 'layer-group']" @click="openAppMenu()" />
        <font-awesome-icon class="icon" v-if="!currentUser?.userData?.profilePic" @click="openAccountMenu()"
          icon="fa-solid fa-user" />
        <img class="profile-pic" v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic"
          @click="openAccountMenu()" alt="">
      </div>
    </div>
    <div class="menu-mobile-container">
      <MenuMobile />
    </div>
  </ul>
</template>