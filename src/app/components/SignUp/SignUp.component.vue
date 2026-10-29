<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted, computed, ref, watch } from 'vue';
import { API_URL } from '../../../middlewares/misc/const';
import { useStore } from '../../../middlewares/store/index';
import { allowedCallback } from '../../../utils/allowedCallback';
import PasswordInput from '../PasswordInput/PasswordInput.component.vue';
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
// While the account is made, the form can't be changed nor sent again.
const submitting = ref(false);

const isDisabled = computed(() => {
  return !username.value || !email.value || !password.value;
});

onMounted(() => {
  const rawCallback = route.query.callback;
  // Only a destination a login may send the user to is kept: any other is dropped.
  callback.value = allowedCallback(rawCallback);
  apiUrl.value = callback.value
    ? `${API_URL}/signup-google?callback=${encodeURIComponent(callback.value)}`
    : `${API_URL}/signup-google`;

  redirectIfLogged();
});

const redirectIfLogged = () => {
  if (!logged.value) return;
  if (callback.value) window.location.href = callback.value;
  else router.push('/');
};

watch(logged, (newVal) => {
  if (newVal) redirectIfLogged();
});

const handleRegister = async (e: Event) => {
  e.preventDefault();
  if (submitting.value) return;
  submitting.value = true;

  try {
    const formData = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const path = await store.handleRegister(formData);
    router.push(path);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

</script>

<template>
  <div class="form-container">
    <h2>Rellena los siguientes campos:</h2>
    <form class="ul-form">
      <li class="li-form">
        <label>Nombre de usuario</label>
        <!-- Not the login's identifier: the password manager keeps the email as it (below). -->
        <input required v-model="username" class="input-form" type="text" name="nickname" autocomplete="nickname" :disabled="submitting" />
      </li>
      <li class="li-form">
        <label>Correo electrónico</label>
        <input required v-model="email" class="input-form" type="email" name="email" autocomplete="username" :disabled="submitting" />
      </li>
      <li class="li-form">
        <label>Contraseña</label>
        <PasswordInput v-model="password" name="password" autocomplete="new-password" :disabled="submitting" />
      </li>
      <button :disabled="isDisabled || submitting" class="submit-button" data-testid="register-submit" @click="handleRegister">
        <font-awesome-icon v-if="submitting" icon="fa-solid fa-spinner" spin />
        {{ submitting ? 'Creando cuenta…' : 'Registrarse' }}
      </button>
    </form>
    <div class="separator-container">
      <div class="separator"></div>
      <span>O</span>
      <div class="separator"></div>
    </div>
    <p>puedes crear una cuenta mediante:</p>
    <a :href="apiUrl" :class="{ 'link-disabled': submitting }" :aria-disabled="submitting">
      <div class="google-button">
        <img :src="googleIcon" alt="" />
        Google
      </div>
    </a>
  </div>
  <span class="flex gap-1 items-center">
    <p>¿Ya tienes una cuenta?</p>
    <router-link :to="callback ? '/login?callback=' + encodeURIComponent(callback) : '/login'">
      <font-awesome-icon icon="fa-solid fa-user" />
      Inicia sesión
    </router-link>
  </span>
</template>


<style scoped lang="scss" src="./SignUp.component.scss"></style>