<script setup lang="ts">
import NavBar from './app/components/Navigator/NavBar.component.vue';
import LateralBar from './app/components/Navigator/LateralBar.component.vue';
import { useStore } from './middlewares/store/index';

const store: any = useStore();
const token: any = localStorage.getItem('userToken');
token && store.handleUserData(token);

</script>

<template>
  <div class="viewport-container">
    <template v-if="$route.path !== '/oauth/chooseaccount/' && !$route.path.startsWith('/oauth/chooseaccount/')">
      <nav-bar />
    </template>
    <div class="app-container">
      <div class="view-lateral-bar">
        <lateral-bar />
      </div>
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>