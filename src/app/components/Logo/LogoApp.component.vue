<style scoped lang="scss" src="./LogoApp.component.scss" />
<script setup lang="ts">
import nhexaLogo from '../../../assets/svg/nhexa-logo.svg'

defineProps({
  logo: String,
});
</script>

<template>
  <div class="logotype">
    <img v-if="logo" class="app-logo" :src="logo">
    <img v-else class="nhexa-logo" :src="nhexaLogo">
  </div>
</template>