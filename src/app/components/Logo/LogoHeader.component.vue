<style scoped lang="scss" src="./LogoHeader.component.scss" />
<script setup lang="ts">
import logo from '../../../assets/svg/nhexa-logo.svg'
</script>

<template>
  <div class="logotype">
    <img :src="logo" height="200">
    <p class="type">NHEXA</p>
  </div>
</template>