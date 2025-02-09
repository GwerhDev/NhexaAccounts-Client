<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import laruinatvLogo from "../../../assets/png/ruina-tv-logo.png";
import musicIcon from "../../../assets/svg/music-icon.svg";
import cartIcon from "../../../assets/png/cart-icon.png";

import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { getUserToken } from '../../../helpers';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);

const urlTv: string = "https://tv.laruina.cl";
const urlPlay: string = "https://play.laruina.cl";
const urlMerch: string = "https://merch.laruina.cl";

const loggedUrlTv: string = urlTv + '/auth?token=' + getUserToken();
const loggedUrlPlay: string = urlPlay + '/auth?token=' + getUserToken();
</script>

<template>
  <section class="section-container">
    <div class="inner-container">
      <h2>Visita nuestras aplicaciones</h2>
      <div class="app-container">
        <a class="app-card" :href="logged ? loggedUrlTv : urlTv">
          <img :src="laruinatvLogo" alt="">
        </a>
        <a class="app-card" :href="logged ? loggedUrlPlay : urlPlay">
          <img :src="musicIcon" alt="">
          <h2>La Ruina Play</h2>
        </a>
        <a class="app-card" :href="urlMerch">
          <img :src="cartIcon" alt="">
          <h2>La Ruina Merch</h2>
        </a>
      </div>
    </div>
  </section>
</template>