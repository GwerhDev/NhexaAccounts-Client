<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from './middlewares/store/index';
import NavBar from './app/components/Navigator/NavBar.component.vue';
import LateralBar from './app/components/Navigator/LateralBar.component.vue';
import SplashLoader from './app/components/Loaders/SplashLoader.vue';

const store: any = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const isFetchingUser = ref(true);

onMounted(async () => {
  await store.handleUserData();
  isFetchingUser.value = false;
});

</script>

<template>
  <SplashLoader v-if="isFetchingUser" />
  <div v-else class="viewport-container">
    <template v-if="$route.path !== '/oauth/chooseaccount/' && !$route.path.startsWith('/oauth/chooseaccount/')">
      <nav-bar />
    </template>
    <div class="app-container">
      <div v-if="logged" class="view-lateral-bar">
        <lateral-bar />
      </div>
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>