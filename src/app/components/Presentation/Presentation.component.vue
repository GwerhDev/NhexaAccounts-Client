<script setup lang="ts">
import { computed } from 'vue';
import LogoHeader from "../Logo/LogoHeader.component.vue";
import SecurityScore from "../SecurityScore/SecurityScore.component.vue";
import GamificationCard from "../GamificationCard/GamificationCard.component.vue";
import defaultImage from '../../../assets/svg/user-icon.svg';
import { useStore } from '../../../middlewares/store';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const username: any = computed(() => currentUser.value.userData?.username);
const email: any = computed(() => currentUser.value.userData?.email);
const isVerified: any = computed(() => currentUser.value.userData?.isVerified);
const role: any = computed(() => currentUser.value.userData?.role);
const profilePic: any = computed(() => currentUser.value.userData?.profilePic ?? defaultImage);

const roleLabel: any = computed(() => {
  if (role.value === 'admin') return 'Administrador';
  if (role.value === 'moderator') return 'Moderador';
  return 'Usuario';
});
</script>

<template>
  <section>
    <div v-if="logged" class="presentation">
      <div>
        <img class="profile-pic" :src="profilePic" alt="">
      </div>
      <span class="welcome-message">
        <h1>¡Hola, {{ username }}!</h1>
      </span>
      <div class="account-summary">
        <span class="account-email">
          <font-awesome-icon icon="fa-solid fa-at" />
          {{ email }}
          <span class="verified-chip" :class="isVerified ? 'verified' : 'unverified'" :title="isVerified ? 'Cuenta verificada' : 'Cuenta sin verificar'">
            <font-awesome-icon :icon="isVerified ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'" />
          </span>
        </span>
        <span class="account-role">
          <font-awesome-icon icon="fa-solid fa-tag" />
          {{ roleLabel }}
        </span>
      </div>
      <GamificationCard />
      <SecurityScore />
    </div>

    <div class="presentation" v-else>
      <LogoHeader />
      <span class="buttons-container w-full mt-1 mb-1">
        <router-link class="w-full" to='/login'>
          <button class="w-full principal-button">
            Iniciar sesión
          </button>
        </router-link>
        <router-link class="w-full" to='/register'>
          <button class="w-full secondary-button">
            Registrarse
          </button>
        </router-link>
      </span>
      <h2>Aquí encontrarás:</h2>
      <div class="services">
        <div class="section">
          <font-awesome-icon icon="fa-solid fa-layer-group" class="service-icon" />
          <div class="vertical-separator"></div>
        </div>
        <ul>
          <h2>Acceso a tus aplicaciones</h2>
          <p>Navega entre nuestras aplicaciones, y descubre el contenido que tenemos disponible para ti.</p>
        </ul>
      </div>
      <div class="services">
        <div class="section">
          <font-awesome-icon icon="fa-solid fa-id-card" class="service-icon" />
          <div class="vertical-separator"></div>
        </div>
        <ul>
          <h2>Administración de cuentas</h2>
          <p>Aquí puedes gestionar los datos de tus cuentas de nuestro entorno de aplicaciones web.</p>
        </ul>
      </div>
      <div class="services">
        <div class="section">
          <font-awesome-icon icon="fa-solid fa-headset" class="service-icon" />
          <div class="vertical-separator"></div>
        </div>
        <ul>
          <h2>Soporte técnico</h2>
          <p>Puedes comunicarte con nuestro equipo para solucionar problemas y despejar dudas.</p>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./Presentation.component.scss"></style>