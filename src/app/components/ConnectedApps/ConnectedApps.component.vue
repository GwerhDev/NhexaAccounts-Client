<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../../../middlewares/store';

const store = useStore();
const loading = ref(true);
const appList = computed(() => store.appList.flatMap(cat => cat.apps));

onMounted(async () => {
  await store.handleGetNhexaEnv();
  loading.value = false;
});
</script>

<template>
  <section class="section-container">
    <div class="inner-container">
<div v-if="loading" class="apps-state">
        <div class="apps-spinner" />
      </div>

      <div v-else-if="!appList.length" class="apps-state">
        <font-awesome-icon icon="fa-solid fa-layer-group" class="apps-empty-icon" />
        <p>No hay aplicaciones disponibles por el momento.</p>
      </div>

      <ul v-else class="apps-grid">
        <li v-for="item in appList" :key="item.url">
          <a class="app-card" :href="item.url" target="_blank" :style="{ '--accent': item.color }">
            <span class="app-icon">
              <img v-if="item.icon" :src="item.icon" :alt="item.label" />
              <font-awesome-icon v-else icon="fa-solid fa-layer-group" />
            </span>
            <div class="app-info">
              <span class="app-name">{{ item.label }}</span>
              <span v-if="item.description" class="app-description">{{ item.description }}</span>
            </div>
            <font-awesome-icon icon="fa-solid fa-arrow-right" class="app-arrow" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
