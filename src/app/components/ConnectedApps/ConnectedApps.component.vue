<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { getUserToken } from '../../../helpers';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);

const urlVision: string = "https://vision.nhexa.cl";
const urlPod: string = "https://spell.nhexa.cl";
const urlMerch: string = "https://merch.nhexa.cl";

const loggedUrlTv: string = urlVision + '/auth?token=' + getUserToken();
const loggedUrlPlay: string = urlPod + '/auth?token=' + getUserToken();
</script>

<template>
  <section class="section-container">
    <div class="inner-container">
      <h2>Visita nuestras aplicaciones</h2>
      <div class="app-container">
        <a class="app-card" :href="logged ? loggedUrlTv : urlVision">
          <h2>Nhexa Vision</h2>
        </a>
        <a class="app-card" :href="logged ? loggedUrlPlay : urlPod">
          <h2>Nhexa Spell</h2>
        </a>
        <a class="app-card" :href="urlMerch">
          <h2>Nhexa Merch</h2>
        </a>
      </div>
    </div>
  </section>
</template>