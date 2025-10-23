<style scoped lang="scss" src="./AppMenu.scss" />
<script setup lang="ts">
import { onMounted, computed, Ref, onUnmounted, ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { closeMenu } from '../../../helpers/menu';
import SkeletonLoader from '../Loaders/SkeletonLoader.component.vue';

const store = useStore();
const appList: Ref<any[]> = computed(() => store.appList.user);

function select() {
  closeMenu();
};

onMounted(() => {
  store.handleGetAppList();
});

const showDropdown = ref(false);
const appMenuButton = ref<HTMLSpanElement | null>(null);

const toggleDropdown = () => {
  showDropdown.value = true;
};

const handleClickOutside = (event: MouseEvent) => {
  if (appMenuButton.value && !appMenuButton.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <span class="app-menu-button" ref="appMenuButton">
    <font-awesome-icon class="icon" :icon="['fas', 'layer-group']" @click="toggleDropdown" />
    <div class="dropdown" v-if="showDropdown">
      <div class="app-menu-container">
        <div class="header">
          <font-awesome-icon icon="fa-solid fa-layer-group" size="2x" />
          <h4>Apps</h4>
        </div>
        <div class="separator"></div>
        <ul class="loader-container" v-if="appList?.length">
          <li v-for="item in appList">
            <a :href="item.url" class="app-card-container" @click="select">
              <img :src="item.icon" alt="">
              {{ item.label }}
            </a>
          </li>
        </ul>
        <ul v-else class="loader-container">
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
  </span>
</template>