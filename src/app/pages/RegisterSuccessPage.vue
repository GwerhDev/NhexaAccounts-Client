<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <div class="px-1 flex-col items-center text-center">
      <h1>¡Registro exitoso!</h1>
      <h3>Gracias por registrarte. Tu cuenta ha sido creada con éxito.</h3>
      <font-awesome-icon icon="fa-solid fa-user-check" size="10x" color="var(--primary-color)" />
      <p><i>Ahora puedes iniciar sesión y completar el registro</i></p>
      <router-link class="principal-button" to="/login">Iniciar sesión</router-link>
    </div>
  </main>
</template>