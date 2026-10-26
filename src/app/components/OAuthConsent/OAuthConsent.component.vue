<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../../../middlewares/store/index';
import { getOAuthAuthorizeRequest, sendOAuthDecision, OAuthAuthorizeRequest } from '../../../middlewares/services';
import { authorizeQuery, failureMessage, loginLocation, nextAuthorizeStep, scopeLabel } from '../../../utils/oauthAuthorize';
import LogoApp from '../Logo/LogoApp.component.vue';
import SkeletonLoader from '../Loaders/SkeletonLoader.component.vue';
import defaultImage from '../../../assets/svg/user-icon.svg';

const store = useStore();
const route = useRoute();
const router = useRouter();

const query = authorizeQuery(route.query);
const request = ref<OAuthAuthorizeRequest | null>(null);
const errorMessage = ref('');
const sending = ref(false);

const userData = computed(() => store.currentUser?.userData);
const profilePic = computed(() => userData.value?.profilePic ?? defaultImage);

// Sends the user back to the app: a full navigation, the app is somewhere else.
const leave = (to: string) => window.location.assign(to);

const decide = async (approve: boolean) => {
  sending.value = true;
  const result = await sendOAuthDecision(query, approve);
  if ('redirectTo' in result && result.redirectTo) return leave(result.redirectTo);
  sending.value = false;
  request.value = null;
  errorMessage.value = 'error' in result ? failureMessage(result) : failureMessage({ error: 'server_error' });
};

const goToLogin = () => router.replace(loginLocation(window.location.href));

const useAnotherAccount = async () => {
  await store.logout();
  goToLogin();
};

onMounted(async () => {
  // Shown inside another site's frame, the buttons could be clicked by the user unawares.
  if (window.top !== window.self) {
    errorMessage.value = 'Esta página no puede mostrarse dentro de otro sitio.';
    return;
  }
  const step = nextAuthorizeStep(await getOAuthAuthorizeRequest(query), !!store.currentUser?.logged);
  if (step.kind === 'redirect') return leave(step.to);
  if (step.kind === 'error') errorMessage.value = step.message;
  else if (step.kind === 'login') goToLogin();
  else if (step.kind === 'approve') decide(true);
  else request.value = step.request;
});
</script>

<template>
  <div v-if="errorMessage" class="authorize-error px-1 flex-col items-center text-center">
    <h1>No se pudo autorizar la aplicación</h1>
    <h3>{{ errorMessage }}</h3>
    <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="10x" color="var(--primary-color)" />
    <p><i>Vuelve a la aplicación e inténtalo nuevamente</i></p>
    <router-link class="principal-button" to="/">Volver al inicio</router-link>
  </div>

  <div v-else class="consent-container">
    <template v-if="request">
      <span class="logo-container">
        <LogoApp />
        <font-awesome-icon icon="fa-solid fa-exchange" size="lg" />
        <LogoApp v-if="request.client.logoUri" :logo="request.client.logoUri" />
        <font-awesome-icon v-else class="app-icon" icon="fa-solid fa-cube" size="3x" />
      </span>

      <h2><span class="app-name">{{ request.client.name }}</span> quiere acceder a tu cuenta de Nhexa</h2>

      <div class="account">
        <img class="profile-pic" :src="profilePic" alt="">
        <div class="account-data">
          <span class="font-bold">{{ userData?.username }}</span>
          <small>{{ userData?.email }}</small>
        </div>
      </div>

      <p v-if="!request.client.verified" class="unverified">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
        Nhexa no ha verificado esta aplicación. Autorízala solo si confías en ella.
      </p>

      <p class="description">Esto permitirá a <span class="font-bold">{{ request.client.name }}</span>:</p>
      <ul class="scopes">
        <li v-for="scope in request.scopes" :key="scope">
          <font-awesome-icon icon="fa-solid fa-check" />
          {{ scopeLabel(scope) }}
        </li>
      </ul>

      <p class="redirect"><small>Al responder, se te redireccionará a: {{ request.redirectUri }}</small></p>

      <div class="actions">
        <button class="secondary-button" :disabled="sending" @click="decide(false)">Cancelar</button>
        <button class="principal-button" :disabled="sending" @click="decide(true)">Autorizar</button>
      </div>

      <button class="another-account" :disabled="sending" @click="useAnotherAccount">
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
        Usar otra cuenta
      </button>
    </template>

    <SkeletonLoader v-else class="loader" />
  </div>
</template>

<style scoped lang="scss" src="./OAuthConsent.component.scss" />
