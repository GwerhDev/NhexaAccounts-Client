<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from './middlewares/store/index';
import SplashLoader from './app/components/Loaders/SplashLoader.vue';
import Toast from './app/components/Toast/Toast.component.vue';

const store = useStore();
// Pages render once the session is known: the guard and the OAuth page both rely on it.
const isFetchingUser = ref(true);

onMounted(async () => {
  await store.handleUserData();
  isFetchingUser.value = false;
});
</script>

<template>
  <Toast />
  <SplashLoader v-if="isFetchingUser" />
  <router-view v-else />
</template>
