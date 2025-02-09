<style scoped lang="scss" src="./NavDesktop.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { openAccountMenu, openAppMenu } from '../../../helpers/menu';
import Logo from '../Logo/Logo.component.vue';
import userIcon from '../../../assets/svg/user-icon.svg';
import appmenuIcon from '../../../assets/svg/appmenu-icon.svg';

const store: any = useStore();
const currentUser: any = computed(() => store.currentUser);

</script>

<template>
  <nav class="nav-desk-container">
    <div class="d-flex align-cent logo-container">
      <div class="d-flex align-cent logo-cont">
        <Logo />
      </div>

      <div class="user-button">
        <img :src="appmenuIcon" width="22" alt="" @click="openAppMenu()">
        <img v-if="!currentUser?.userData?.profilePic" :src="userIcon" alt="" width="25" @click="openAccountMenu()">
        <img class="profile-pic" v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic"
          @click="openAccountMenu()" alt="">
      </div>
    </div>
  </nav>
</template>