<style scoped lang="scss" src="./AccountMenu.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const pathAccount: string = '/account/settings/';

CanvasMenuFunction("#account-menu-container");

function logout() {
  store.logout();
  closeMenu();
  closeAccountMenu();
};

function select() {
  closeAccountMenu();
  closeMenu();
};

</script>

<template>
  <ul class="account-menu-container" id="account-menu-container">
    <li v-if="!logged">
      <router-link class="menu-text principal-button" to='/login' @click="select()">
        Iniciar sesión
      </router-link>
    </li>
    <li v-if="!logged">
      <router-link class="menu-text secondary-button" to='/register' @click="select()">
        Registrarse
      </router-link>
    </li>
    <li class="current-user-data" v-if="logged">
      <h2>{{ currentUser?.userData?.username }}</h2>
      <img v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic" alt="">
      <font-awesome-icon v-else icon="fa-solid fa-user" />
      <p>{{ currentUser?.userData?.role }}</p>
    </li>
    <div class="separator"></div>
    <li v-if="logged">
      <router-link class="menu-text principal-button" :to="pathAccount" @click="select()">
        Administrar cuenta
      </router-link>
    </li>
    <li v-if="logged">
      <router-link class="menu-text secondary-button" to='/' @click="logout()">
        Cerrar sesión
      </router-link>
    </li>
  </ul>
</template>