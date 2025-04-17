<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted, computed, ref, watch } from 'vue';
import { API_URL } from '../../../middlewares/misc/const';
import { useStore } from '../../../middlewares/store/index';
import LogoHeader from '../Logo/LogoHeader.component.vue';
import googleIcon from '../../../assets/png/google-icon.png';

const apiUrl = ref('');
const callback = ref('');
const store = useStore();
const route = useRoute();
const router = useRouter();

const currentUser = computed(() => store.currentUser);
const logged = computed(() => currentUser.value.logged);

const email = ref('');
const password = ref('');

const isDisabled = computed(() => {
  return !email.value || !password.value;
});

onMounted(() => {
  const rawCallback = route.query.callback;
  callback.value = typeof rawCallback === 'string' ? rawCallback : '';
  apiUrl.value = callback.value
    ? `${API_URL}/login-google?callback=${callback.value}`
    : `${API_URL}/login-google`;

  redirectIfLogged();
});

const redirectIfLogged = () => {
  if (logged.value) {
    const rawCallback = route.query.callback;
    const target = typeof rawCallback === 'string' ? rawCallback : '/';
    router.push(target);
  }
};

watch(logged, (newVal) => {
  if (newVal) redirectIfLogged();
});

async function handleLogin(e: Event) {
  e.preventDefault();
  const formData = {
    email: email.value,
    password: password.value,
  };
  try {
    const path = await store.handleLogin(formData, callback.value);
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
    <p v-if="callback"><small>Al iniciar sesión, se te redireccionará a: <a :href="callback">{{ callback }}</a></small></p>
    <form class="ul-form">
      <li class="li-form">
        <label>Correo electrónico</label>
        <input required v-model="email" class="input-form" type="email" />
      </li>
      <li class="li-form">
        <label>Contraseña</label>
        <input required v-model="password" class="input-form" type="password" />
      </li>
      <button :disabled="isDisabled" class="submit-button" @click="handleLogin">Iniciar Sesión</button>
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
  <span class="flex gap-1 items-center">
    <p>¿Aun no tienes una cuenta?</p>
    <router-link :to="callback ? '/register?callback=' + encodeURIComponent(callback) : '/register'">
      <font-awesome-icon icon="fa-solid fa-user-plus" />
      Registrarse
    </router-link>
  </span>
</template>

<style scoped lang="scss" src="./LogIn.component.scss" />