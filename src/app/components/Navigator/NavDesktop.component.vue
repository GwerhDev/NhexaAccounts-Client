<style scoped lang="scss" src="./NavDesktop.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { openAccountMenu, openAppMenu } from '../../../helpers/menu';
import Logo from '../Logo/Logo.component.vue';

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
        <font-awesome-icon class="icon" :icon="['fas', 'layer-group']" @click="openAppMenu()" />
        <font-awesome-icon class="icon" v-if="!currentUser?.userData?.profilePic" @click="openAccountMenu()"
          icon="fa-solid fa-user" />
        <img class="profile-pic" v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic"
          @click="openAccountMenu()" alt="">
      </div>
    </div>
  </nav>
</template>