<script setup lang="ts">
import AccountSettings from "../components/AccountSettings/AccountSettings.component.vue";

const fields = [
  {
    key: '',
    title: '',
    label: '',
    type: '',
    value: '',
  },
];
</script>

<template>
  <main class="main-container">
    <AccountSettings :fields="fields" />
  </main>
</template>