<script setup lang="ts">
</script>

<template>
  <main class="main-container">
    <div class="px-1 flex-col items-center text-center">
      <h1>La cuenta no existe</h1>
      <h3>El correo electrónico con el que has ingresado no se encuentra registrado.</h3>
      <font-awesome-icon icon="fa-solid fa-server" size="10x" color="var(--primary-color)" />
      <p><i>Si quieres, puedes ingresar con otra cuenta o crear una:</i></p>
      <span class="flex gap-1">
        <router-link class="principal-button gap-1 items-center" to="/login">
          <font-awesome-icon icon="fa-solid fa-user" />
          Ingresar
        </router-link>
        <router-link class="secondary-button gap-1 items-center" to="/register">
          <font-awesome-icon icon="fa-solid fa-user-plus" />
          Registrarse
        </router-link>
      </span>
    </div>
  </main>
</template>