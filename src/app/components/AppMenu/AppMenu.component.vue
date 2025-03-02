<style scoped lang="scss" src="./AppMenu.component.scss" />
<script setup lang="ts">
import { onMounted, computed, Ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const token: any = computed(() => store.userToken);
const appList: Ref<any[]> = computed(() => store.appList);
const logged: any = computed(() => currentUser.value.logged);

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
      <font-awesome-icon :icon="['fas', 'layer-group']" />
      <h4>Apps</h4>
    </li>
    <div class="separator"></div>
    <li v-if="appList.length" v-for="item in appList">
      <a :href="logged ? item.url + '/auth?token=' + token : item.url" class="app-card-container" @click="select">
        {{ item.label }}
      </a>
    </li>
    <li v-else>
      <div class="loader"></div>
    </li>
  </ul>
</template>