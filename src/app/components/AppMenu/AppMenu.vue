<style scoped lang="scss" src="./AppMenu.scss" />
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import AppDesktop from './AppDesktop.component.vue';

const store = useStore();
const isOpen = ref(false);

onMounted(() => {
  if (!store.appList.length) store.handleGetNhexaEnv();
});
</script>

<template>
  <span class="app-menu-button">
    <font-awesome-icon class="icon" :icon="['fas', 'layer-group']" @click="isOpen = true" />
    <Teleport to="body">
      <AppDesktop v-if="isOpen" @close="isOpen = false" />
    </Teleport>
  </span>
</template>
