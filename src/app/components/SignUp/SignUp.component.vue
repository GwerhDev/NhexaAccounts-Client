<script setup lang="ts">
import { API_URL } from '../../../middlewares/misc/const';
import { useStore } from '../../../middlewares/store/index';
import { useRouter } from 'vue-router';
import { onMounted, computed, Ref, ref } from 'vue';
import { getUserToken } from '../../../helpers';
import googleIcon from '../../../assets/png/google-icon.png';
import LogoHeader from '../Logo/LogoHeader.component.vue';

const token: Ref = ref("");
const store: any = useStore();
const router: any = useRouter();
const apiUrl: string = API_URL + "/signup-google";
const currentUser: any = computed(() => store.currentUser);

let username = "";
let email = "";
let password = "";

onMounted(() => {
  token.value = getUserToken();
  if (!currentUser?.value.error && token.value) {
    router.push('/');
  }
});

async function handleRegister(e: any) {
  e.preventDefault();
  const formData: any = { username, email, password };
  try {
    const path: any = await store.handleRegister(formData);
    router.push(path);
  } catch (error) {
    console.error(error)
  }
}

</script>

<template>
  <div class="form-container">
    <LogoHeader />
    <h2>Rellena los siguientes campos:</h2>
    <form class="ul-form">
      <li class="li-form">
        <label>Nombre de usuario</label>
        <input v-model="username" class="input-form" type="text" />
      </li>
      <li class="li-form">
        <label>Correo electrónico</label>
        <input v-model="email" class="input-form" type="email" />
      </li>
      <li class="li-form">
        <label>Contraseña</label>
        <input v-model="password" class="input-form" type="password" />
      </li>
      <button class="submit-button" @click="handleRegister">Registrarse</button>
    </form>
    <div class="separator-container">
      <div class="separator"></div>
      <span>O</span>
      <div class="separator"></div>
    </div>
    <p>puedes crear una cuenta mediante:</p>
    <a :href="apiUrl">
      <div class="google-button">
        <img :src="googleIcon" alt="">
        Google
      </div>
    </a>
  </div>
</template>

<style scoped lang="scss" src="./SignUp.component.scss"></style>