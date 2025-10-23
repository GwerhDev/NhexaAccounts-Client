<style scoped lang="scss" src="./Logo.component.scss" />
<script setup lang="ts">
import { closeMenu } from '../../../helpers/menu';
import { CLIENT_URL } from '../../../middlewares/misc/const';
import logo from '../../../assets/svg/nhexa-logo.svg';

defineProps({
  width: String
});

</script>

<template>
  <a class="d-flex align-cent logotype" :href="CLIENT_URL">
    <img :src="logo" @click="closeMenu()" :width="width || '50'" alt="">
    <p class="type">NHEXA</p>
  </a>
</template>