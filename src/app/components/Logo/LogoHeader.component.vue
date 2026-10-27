<style scoped lang="scss" src="./LogoHeader.component.scss" />
<script setup lang="ts">
import logo from '../../../assets/svg/nhexa-logo.svg'

// The logo's height in px; the name below it keeps its proportion (40px for the full 200).
const props = withDefaults(defineProps<{ size?: number }>(), { size: 200 });
</script>

<template>
  <div class="logotype">
    <img :src="logo" :height="props.size">
    <p class="type" :style="{ fontSize: `${props.size / 5}px` }">NHEXA</p>
  </div>
</template>
