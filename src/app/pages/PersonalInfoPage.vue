<script setup lang="ts">
import AccountSettings from "../components/AccountSettings/AccountSettings.component.vue";

const fields = [
  {
    key: 'username',
    title: 'Datos personales',
    label: 'Nombre de usuario',
    type: 'text',
    value: '',
  },
  {
    key: 'email',
    title: 'Email',
    label: 'Correo electrónico',
    type: 'text',
    value: '',
  }
];
</script>

<template>
  <main class="main-container">
    <AccountSettings :fields="fields" />
  </main>
</template>