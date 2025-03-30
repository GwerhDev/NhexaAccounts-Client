<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <div class="px-1 flex-col items-center text-center">
      <h1>Inicio de sesión fallido</h1>
      <h3>Un error ha ocurrido al intentar ingresar a tu cuenta.</h3>
      <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="10x" color="var(--primary-color)" />
      <p><i>Por favor, intente nuevamente</i></p>
      <router-link class="principal-button" to="/login">Iniciar sesión</router-link>
    </div>
  </main>
</template>