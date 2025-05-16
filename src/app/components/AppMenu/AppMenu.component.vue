<style scoped lang="scss" src="./AppMenu.component.scss" />
<script setup lang="ts">
import { onMounted, computed, Ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';
import SkeletonLoader from '../Loaders/SkeletonLoader.component.vue';

const store = useStore();
const appList: Ref<any[]> = computed(() => store.appList);

CanvasMenuFunction("#app-menu-container");

function select() {
  closeAccountMenu();
  closeMenu();
};

onMounted(() => {
  store.handleGetAppList();
});

</script>

<template>
  <div class="app-menu-container" id="app-menu-container">
    <li class="current-user-data">
      <font-awesome-icon icon="fa-solid fa-layer-group" size="2x" />
      <h4>Apps</h4>
    </li>
    <div class="separator"></div>
    <ul class="loader-container" v-if="appList.length">
      <li v-for="item in appList">
        <a :href="item.url" class="app-card-container" @click="select">
          <img :src="item.icon" alt="">
          {{ item.label }}
        </a>
      </li>
    </ul>
    <div v-else>
      <ul class="loader-container">
        <li>
          <SkeletonLoader />
        </li>
        <li>
          <SkeletonLoader />
        </li>
        <li>
          <SkeletonLoader />
        </li>
      </ul>
    </div>
  </div>
</template>