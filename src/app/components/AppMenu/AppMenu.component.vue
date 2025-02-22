<style scoped lang="scss" src="./AppMenu.component.scss" />
<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const token: any = computed(() => store.userToken);
const logged: any = computed(() => currentUser.value.logged);
const nhexapodUrl: Ref = ref("https://pod.nhexa.cl");
const nhexamerchUrl: Ref = ref("https://merch.nhexa.cl");
const nhexavisionUrl: Ref = ref("https://vision.nhexa.cl");

CanvasMenuFunction("#app-menu-container");

function select() {
  closeAccountMenu();
  closeMenu();
};

</script>

<template>
  <ul class="app-menu-container" id="app-menu-container">
    <li class="current-user-data">
      <font-awesome-icon :icon="['fas', 'layer-group']" />
      <h4>Apps</h4>
    </li>
    <div class="separator"></div>
    <a :href="logged ? nhexavisionUrl + '/auth?token=' + token : nhexavisionUrl" class="app-card-container" @click="select">
      Nhexa Vision
    </a>
    <a :href="logged ? nhexapodUrl + '/auth?token=' + token : nhexapodUrl" class="app-card-container"
      @click="select">
      Nhexa Pod
    </a>
    <a :href="nhexamerchUrl" class="app-card-container" @click="select">
      Nhexa Merch
    </a>
  </ul>
</template>