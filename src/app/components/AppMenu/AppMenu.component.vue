<style scoped lang="scss" src="./AppMenu.component.scss" />
<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';
import appstabIcon from '../../../assets/svg/appstab-icon.svg';
import laruinatvLogo from '../../../assets/png/ruina-tv-logo.png'

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const token: any = computed(() => store.userToken);
const logged: any = computed(() => currentUser.value.logged);
const laruinatvUrl: Ref = ref("https://tv.laruina.cl");
const laruinaplayUrl: Ref = ref("https://play.laruina.cl");
const laruinamerchUrl: Ref = ref("https://merch.laruina.cl");

CanvasMenuFunction("#app-menu-container");

function select() {
  closeAccountMenu();
  closeMenu();
};

</script>

<template>
  <ul class="app-menu-container" id="app-menu-container">
    <li class="current-user-data">
      <img :src="appstabIcon" alt="">
      <h4>Apps</h4>
    </li>
    <div class="separator"></div>
    <a :href="logged? laruinatvUrl + '/auth?token=' +  token : laruinatvUrl" class="app-card-container" @click="select">
      <img :src="laruinatvLogo" alt="" height="30">
    </a>
    <a :href="logged? laruinaplayUrl + '/auth?token=' +  token : laruinaplayUrl" class="app-card-container" @click="select">
      La Ruina Play
    </a>
    <a :href="laruinamerchUrl" class="app-card-container" @click="select">
      La Ruina Merch
    </a>
  </ul>
</template>