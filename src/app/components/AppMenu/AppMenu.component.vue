<style scoped lang="scss" src="./AppMenu.component.scss" />
<script setup lang="ts">
import { onMounted, computed, Ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';
import Loader from '../Loaders/Loader.component.vue';
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
  <ul class="app-menu-container" id="app-menu-container">
    <li class="current-user-data">
      <font-awesome-icon icon="fa-solid fa-layer-group" size="2x" />
      <h4>Apps</h4>
    </li>
    <div class="separator"></div>
    <li v-if="appList.length" v-for="item in appList">
      <a :href="item.url" class="app-card-container" @click="select">
        {{ item.label }}
      </a>
    </li>
    <ul class="loader-container" v-else>
      <li>
        <SkeletonLoader />
      </li>
      <li>
        <SkeletonLoader />
      </li>
      <li>
        <SkeletonLoader />
      </li>
      <li>
        <Loader />
      </li>
    </ul>
  </ul>
</template>