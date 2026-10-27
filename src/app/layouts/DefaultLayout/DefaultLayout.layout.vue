<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store/index';
import NavBar from '../../components/Navigator/NavBar.component.vue';
import LateralBar from '../../components/Navigator/LateralBar.component.vue';

const store = useStore();
const logged = computed(() => !!store.currentUser?.logged);
</script>

<template>
  <div class="viewport-container" data-testid="default-layout">
    <NavBar data-testid="nav-bar" />
    <div class="app-container">
      <div v-if="logged" class="view-lateral-bar" data-testid="lateral-bar">
        <LateralBar />
      </div>
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>
