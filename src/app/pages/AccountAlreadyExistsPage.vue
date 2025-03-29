<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <h1>La cuenta ya existe</h1>
    <h3>El correo electrónico con el que has ingresado ya se encuentra registrado.</h3>
    <font-awesome-icon icon="fa-solid fa-server" size="10x" color="var(--primary-color)" />
    <p><i>Si quieres, puedes iniciar sesión con tu cuenta:</i></p>
    <router-link class="principal-button" to="/login">Iniciar sesión</router-link>
  </main>
</template>