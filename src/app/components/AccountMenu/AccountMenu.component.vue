<style scoped lang="scss" src="./AccountMenu.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { CanvasMenuFunction, closeAccountMenu, closeMenu } from '../../../helpers/menu';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const appList: any = computed(() => store.appList.admin);
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
    <li class="current-user-data" v-if="!logged">
      <font-awesome-icon icon="fa-solid fa-user" size="2x" />
      <h4>Cuenta</h4>
    </li>
    <div class="separator" v-if="!logged"></div>
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
      <img v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic" alt="Profile picture">
      <font-awesome-icon v-else icon="fa-solid fa-user" size="2x" />
      <p>{{ currentUser?.userData?.role }}</p>
    </li>
    <div class="role-functions" v-if="logged && appList?.length">
      <li v-for="item in appList" :key="item.label">
        <a :href="item.url" @click="select">
          <img :src="item.icon" alt="" width="24" height="24">
        </a>
      </li>
    </div>
    <div class="separator" v-if="logged"></div>
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