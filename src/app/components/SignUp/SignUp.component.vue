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

const username = ref('');
const email = ref('');
const password = ref('');

const isDisabled = computed(() => {
  return !username.value || !email.value || !password.value;
});

onMounted(() => {
  const rawCallback = route.query.callback;
  callback.value = typeof rawCallback === 'string' ? rawCallback : '';
  apiUrl.value = callback.value
    ? `${API_URL}/signup-google?callback=${callback.value}`
    : `${API_URL}/signup-google`;

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

const handleRegister = async (e: Event) => {
  e.preventDefault();
  const formData = {
    username: username.value,
    email: email.value,
    password: password.value,
  };
  try {
    const path = await store.handleRegister(formData, callback.value);
    router.push(path);
  } catch (error) {
    console.error(error);
  }
};

</script>

<template>
  <div class="form-container">
    <LogoHeader />
    <h2>Rellena los siguientes campos:</h2>
    <form class="ul-form">
      <li class="li-form">
        <label>Nombre de usuario</label>
        <input required v-model="username" class="input-form" type="text" />
      </li>
      <li class="li-form">
        <label>Correo electrónico</label>
        <input required v-model="email" class="input-form" type="email" />
      </li>
      <li class="li-form">
        <label>Contraseña</label>
        <input required v-model="password" class="input-form" type="password" />
      </li>
      <button :disabled="isDisabled" class="submit-button" @click="handleRegister">
        Registrarse
      </button>
    </form>
    <div class="separator-container">
      <div class="separator"></div>
      <span>O</span>
      <div class="separator"></div>
    </div>
    <p>puedes crear una cuenta mediante:</p>
    <a :href="apiUrl">
      <div class="google-button">
        <img :src="googleIcon" alt="" />
        Google
      </div>
    </a>
  </div>
  <span class="flex gap-1 items-center">
    <p>¿Ya tienes una cuenta?</p>
    <router-link to="/login">Inicia sesión</router-link>
  </span>
</template>


<style scoped lang="scss" src="./SignUp.component.scss"></style>