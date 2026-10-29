<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted, computed, ref, watch } from 'vue';
import OtpInput from '../OtpInput/OtpInput.component.vue';
import PasswordInput from '../PasswordInput/PasswordInput.component.vue';
import { API_URL } from '../../../middlewares/misc/const';
import { useStore } from '../../../middlewares/store/index';
import { allowedCallback } from '../../../utils/allowedCallback';
import { callbackNotice } from '../../../utils/callbackNotice';
import { verifyMfa, getUserData } from '../../../middlewares/services';
import LogoApp from '../Logo/LogoApp.component.vue';
import googleIcon from '../../../assets/png/google-icon.png';

const apiUrl = ref('');
const appLogo = ref('');
const callback = ref('');
const store = useStore();
const route = useRoute();
const router = useRouter();

const currentUser = computed(() => store.currentUser);
const logged = computed(() => currentUser.value.logged);

const email = ref('');
const password = ref('');
const step = ref<'credentials' | 'mfa'>('credentials');
const mfaToken = ref('');
const mfaError = ref('');
const loginError = ref('');
// While the credentials are checked, the form can't be changed nor sent again.
const submitting = ref(false);
const otpLoginRef = ref<InstanceType<typeof OtpInput> | null>(null);

const isDisabled = computed(() => !email.value || !password.value);
const notice = computed(() => callbackNotice(callback.value));

onMounted(() => {
  const rawAppId = route.query.appId;
  const rawCallback = route.query.callback;

  // Only a destination a login may send the user to is kept: any other is dropped.
  callback.value = allowedCallback(rawCallback);
  appLogo.value = typeof rawAppId === 'string' ? "https://streamby.s3.amazonaws.com/" + rawAppId + "/project-image" : '';

  apiUrl.value = callback.value
    ? `${API_URL}/login-google?callback=${encodeURIComponent(callback.value)}`
    : `${API_URL}/login-google`;

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

async function handleLogin(e: Event) {
  e.preventDefault();
  if (submitting.value) return;
  loginError.value = '';
  submitting.value = true;
  try {
    const result = await store.handleLogin({ email: email.value, password: password.value }, callback.value);
    if (result && typeof result === 'object' && result.mfaRequired) {
      mfaToken.value = result.mfaToken;
      step.value = 'mfa';
    } else if (result && typeof result === 'object' && result.error) {
      loginError.value = result.message;
    } else {
      // Signed in: it's leaving the page, so the form stays as it is meanwhile.
      return;
    }
  } catch {
    loginError.value = 'Error al iniciar sesión.';
  }
  submitting.value = false;
}

async function handleMfa(code: string) {
  mfaError.value = '';
  try {
    const result = await verifyMfa(mfaToken.value, code);
    if (result?.logged) {
      if (callback.value) {
        window.location.href = callback.value;
      } else {
        store.currentUser = await getUserData();
      }
    } else {
      mfaError.value = result?.message ?? 'Código inválido.';
      otpLoginRef.value?.reset();
    }
  } catch {
    mfaError.value = 'Error al verificar el código.';
    otpLoginRef.value?.reset();
  }
}
</script>

<template>
  <div class="form-container">
    <span v-if="appLogo" class="logo-container">
      <LogoApp />
      <font-awesome-icon icon="fa-solid fa-exchange" size="lg" />
      <LogoApp :logo=appLogo />
    </span>

    <template v-if="step === 'credentials'">
      <h2>Rellena los siguientes campos:</h2>
      <p v-if="notice" data-testid="callback-notice"><small>{{ notice }}</small></p>
      <form class="ul-form">
        <li class="li-form">
          <label>Correo electrónico</label>
          <input required v-model="email" class="input-form" type="email" name="email" autocomplete="username" :disabled="submitting" />
        </li>
        <li class="li-form">
          <label>Contraseña</label>
          <PasswordInput v-model="password" name="password" autocomplete="current-password" :disabled="submitting" />
        </li>
        <button :disabled="isDisabled || submitting" class="submit-button" data-testid="login-submit" @click="handleLogin">
          <font-awesome-icon v-if="submitting" icon="fa-solid fa-spinner" spin />
          {{ submitting ? 'Iniciando sesión…' : 'Iniciar Sesión' }}
        </button>
        <p v-if="loginError" class="form-error">{{ loginError }}</p>
      </form>
      <div class="separator-container">
        <div class="separator"></div>
        <span>O</span>
        <div class="separator"></div>
      </div>
      <p>puedes iniciar sesión mediante:</p>
      <a :href="apiUrl" :class="{ 'link-disabled': submitting }" :aria-disabled="submitting">
        <div class="google-button">
          <img :src="googleIcon" alt="">
          Google
        </div>
      </a>
    </template>

    <template v-else>
      <h2>Verificación en dos pasos</h2>
      <p><small>Ingresa el código de 6 dígitos de tu app de autenticación.</small></p>
      <div class="ul-form">
        <li class="li-form">
          <OtpInput ref="otpLoginRef" @complete="handleMfa" />
          <span v-if="mfaError" class="field-error">{{ mfaError }}</span>
        </li>
      </div>
      <button class="cancel-button" style="margin-top: 0.75rem" @click="step = 'credentials'; mfaError = ''">
        Volver
      </button>
    </template>
  </div>
  <span v-if="step === 'credentials'" class="flex gap-1 items-center">
    <p>¿Aun no tienes una cuenta?</p>
    <router-link :to="callback ? '/register?callback=' + encodeURIComponent(callback) : '/register'">
      <font-awesome-icon icon="fa-solid fa-user-plus" />
      Registrarse
    </router-link>
  </span>
</template>

<style scoped lang="scss" src="./LogIn.component.scss" />