<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted, computed, Ref, ref } from 'vue';
import { API_URL } from '../../../middlewares/misc/const';
import { useStore } from '../../../middlewares/store/index';
import { getUserToken } from '../../../helpers';
import LogoHeader from '../Logo/LogoHeader.component.vue';
import googleIcon from '../../../assets/png/google-icon.png';

const token: Ref = ref("");
const apiUrl: Ref = ref("");
const callback: Ref = ref("");
const store: any = useStore();
const route: any = useRoute();
const router: any = useRouter();
const currentUser: any = computed(() => store.currentUser);

let email = "";
let password = "";

onMounted(() => {
  callback.value = route.query.callback;
  token.value = getUserToken();
  apiUrl.value = callback.value ? API_URL + "/login-google?callback=" + callback.value : API_URL + "/login-google";

  if(token.value) {
    return router.push('/oauth/chooseaccount?callback=' + encodeURIComponent(callback.value));
  }

  if (!currentUser?.value.error && token.value) {
    const path = callback.value ? (callback.value + 'auth?token=' + token.value) : '/';
    router.push(path);
  }
});

async function handleLogin(e: any) {
  e.preventDefault();
  const formData: any = { email, password };
  try {
    const path: any = await store.handleLogin(formData, callback.value);
    router.push(path);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="form-container">
    <LogoHeader />
    <h2>Rellena los siguientes campos:</h2>
    <form class="ul-form">
      <li class="li-form">
        <label>Correo electrónico</label>
        <input v-model="email" class="input-form" type="email" />
      </li>
      <li class="li-form">
        <label>Contraseña</label>
        <input v-model="password" class="input-form" type="password" />
      </li>
      <button class="submit-button" @click="handleLogin">Iniciar Sesión</button>
    </form>
    <div class="separator-container">
      <div class="separator"></div>
      <span>O</span>
      <div class="separator"></div>
    </div>
    <p>puedes iniciar sesión mediante:</p>
    <a :href="apiUrl">
      <div class="google-button">
        <img :src="googleIcon" alt="">
        Google
      </div>
    </a>
  </div>
</template>

<style scoped lang="scss" src="./LogIn.component.scss" />