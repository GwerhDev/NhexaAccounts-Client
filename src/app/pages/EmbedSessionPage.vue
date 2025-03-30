<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUserToken } from "../../middlewares/services/token";
import { allowedOrigins } from "../../middlewares/misc/const";

const showLogin = ref(false);

onMounted(async () => {

  try {
    const userToken: any = getUserToken();
    const parentOrigin = document.referrer || "*";

    if (allowedOrigins.includes(new URL(parentOrigin).origin)) {
      window.parent.postMessage({ userToken }, parentOrigin);
    } else {
      console.warn("Origen no permitido:", parentOrigin);
    }
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    window.parent.postMessage({ loggedIn: false }, "*");
  }
});
</script>

<template>
  <main class="main-container">
    <iframe v-if="showLogin" src="https://accounts.nhexa.cl/login" width="100%" height="100%" frameborder="0">
    </iframe>
  </main>
</template>
