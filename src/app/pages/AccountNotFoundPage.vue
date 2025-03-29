<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <h1>La cuenta no existe</h1>
    <h3>El correo electrónico con el que has ingresado no se encuentra registrado.</h3>
    <font-awesome-icon icon="fa-solid fa-server" size="10x" color="var(--primary-color)" />
    <p><i>Si quieres, puedes crear una cuenta o ingresar con otra:</i></p>
    <span class="flex gap-1">
      <router-link class="principal-button" to="/register">Registrarse</router-link>
      <router-link class="principal-button" to="/login">Ingresar</router-link>
    </span>
  </main>
</template>