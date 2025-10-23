<style scoped lang="scss" src="./AccMenu.scss" />
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, Ref } from 'vue';
import { useStore } from '../../../middlewares/store';
import { ACCOUNTS_URL, CLIENT_URL } from '../../../middlewares/misc/const';
import { closeMenu } from '../../../helpers/menu';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const appList: any = computed(() => store.appList.admin);

function logout() {
  store.logout();
  closeMenu();
};

function select() {
  closeMenu();
};

const pathAccount: Ref<string> = ref('');
const loginRoute: Ref<string> = ref('');
const signupRoute: Ref<string> = ref('');

const showDropdown = ref(false);
const accMenuButton = ref<HTMLSpanElement | null>(null);

const toggleDropdown = () => {
  showDropdown.value = true;
};

const handleClickOutside = (event: MouseEvent) => {
  if (accMenuButton.value && !accMenuButton.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  loginRoute.value = `${ACCOUNTS_URL}/login?callback=${encodeURIComponent(CLIENT_URL)}`;
  signupRoute.value = `${ACCOUNTS_URL}/register?callback=${encodeURIComponent(CLIENT_URL)}`;
  pathAccount.value = `${ACCOUNTS_URL}/`;
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <span class="acc-menu-button" ref="accMenuButton">
    <font-awesome-icon class="icon" v-if="!currentUser?.userData?.profilePic" icon="fa-solid fa-user"
      @click="toggleDropdown" />
    <img class="profile-pic" v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic"
      @click="toggleDropdown" alt="">
    <div class="dropdown" v-if="showDropdown">
      <ul class="acc-menu-container">
        <li class="current-user-data" v-if="!logged">
          <font-awesome-icon icon="fa-solid fa-user" size="2x" />
          <h4>Cuenta</h4>
        </li>
        <div class="separator" v-if="!logged"></div>
        <li v-if="!logged">
          <a class="menu-text principal-button" :href="loginRoute" @click="select()">
            Iniciar sesión
          </a>
        </li>
        <li v-if="!logged">
          <a class="menu-text secondary-button" :href="signupRoute" @click="select()">
            Registrarse
          </a>
        </li>
        <li class="current-user-data" v-if="logged">
          <h2>{{ currentUser?.userData?.username }}</h2>
          <img v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic" alt="">
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
          <a class="menu-text principal-button" :href="pathAccount" @click="select()">
            Centro de cuentas
          </a>
        </li>
        <li v-if="logged">
          <router-link class="menu-text secondary-button" to='/' @click="logout()">
            Cerrar sesión
          </router-link>
        </li>
      </ul>
    </div>
  </span>
</template>