<script setup lang="ts">
import { ref } from 'vue';
import { API_URL } from '../../middlewares/misc/const';

const googleLoginUrl = ref(`${API_URL}/login-google`);
</script>

<template>
  <main class="main-container">
    <div class="px-1 flex-col items-center text-center">
      <font-awesome-icon icon="fa-solid fa-circle-exclamation" size="6x" color="var(--primary-color)" />
      <h1>Verifica tu cuenta</h1>
      <p>Tu cuenta fue creada pero aún no está verificada.</p>
      <p>
        Para activarla, debes vincularla con tu cuenta de
        <strong>Google</strong>.
      </p>
      <a :href="googleLoginUrl">
        <button class="principal-button mt-1">
          <font-awesome-icon icon="fa-brands fa-google" />
          Vincular con Google
        </button>
      </a>
      <router-link class="mt-1" to="/login">
        <small>Volver al inicio de sesión</small>
      </router-link>
    </div>
  </main>
</template>
