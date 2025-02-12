<script setup lang="ts">
import { computed } from 'vue';
import appIcon from "../../../assets/svg/appstab-icon.svg";
import secureUserIcon from "../../../assets/svg/user-shield-icon.svg";
import supportIcon from "../../../assets/svg/support-icon.svg";
import LogoHeader from "../Logo/LogoHeader.component.vue";
import defaultImage from '../../../assets/svg/user-icon.svg';
import { useStore } from '../../../middlewares/store';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
let logged: any = computed(() => currentUser.value.logged);
let username: any = computed(() => currentUser.value.userData?.username);
let profilePic: any = computed(() => currentUser.value.userData?.profilePic ?? defaultImage);

</script>

<template>
  <section>
    <div v-if="logged" class="presentation">
      <div>
        <img class="profile-pic" :src="profilePic" width="150" alt="">
      </div>
      <span class="welcome-message">
        <h1>¡Hola, {{ username }}!</h1>
      </span>
      <p>Administra tu información y las opciones de privacidad y seguridad a fin de que NHEXA sea más relevante para
        ti.</p>
    </div>

    <div class="presentation" v-else>
      <LogoHeader />
      <span class="buttons-container w-full mt-1 mb-1" v-if="!logged">
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
    </div>
    <LogoHeader v-if="logged" />

    <div class="services">
      <div class="section">
        <img :src="appIcon" alt="" width="25">
        <div class="vertical-separator"></div>
      </div>
      <ul>
        <h2>Acceso a tus aplicaciones</h2>
        <p>Navega entre nuestras aplicaciones, y descubre el contenido que tenemos disponible para ti.</p>
      </ul>
    </div>
    <div class="services">
      <div class="section">
        <img :src="secureUserIcon" alt="" width="25">
        <div class="vertical-separator"></div>
      </div>
      <ul>
        <h2>Administración de cuentas</h2>
        <p>Aquí puedes gestionar los datos de tus cuentas de nuestro entorno de aplicaciones web.</p>
      </ul>
    </div>
    <div class="services">
      <div class="section">
        <img :src="supportIcon" alt="" width="25">
        <div class="vertical-separator"></div>
      </div>
      <ul>
        <h2>Soporte técnico</h2>
        <p>Puedes comunicarte con nuestro equipo para solucionar problemas y despejar dudas.</p>
      </ul>
    </div>
  </section>


</template>

<style scoped lang="scss" src="./Presentation.component.scss"></style>