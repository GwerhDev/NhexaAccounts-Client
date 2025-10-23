<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../../../middlewares/store';
import { Ref, computed, ref, onMounted } from 'vue';
import { getUserToken } from '../../../middlewares/services/token';
import Loader from '../Loaders/SplashLoader.vue';

const store: any = useStore();
const token: Ref = ref('');
const route: any = useRoute();
const router: any = useRouter();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const email: any = computed(() => currentUser.value.userData.email);
const username: any = computed(() => currentUser.value.userData.username);
const profilePic: any = computed(() => currentUser.value.userData.profilePic);
const uri: any = decodeURIComponent(route.query.callback);
const redirectUrl = uri + "/auth?token=" + getUserToken();

function selectAccount() { window.location.href = redirectUrl };

function login() { router.push('/login') };

onMounted(() => {
  setInterval(() => {
    token.value = getUserToken();
  }, 5000);
});

</script>

<template>
  <div class="list-container">
    <span>Iniciar sesión NHEXA</span>
    <div>
      <h2>Selecciona una cuenta</h2>
      <h3>para ir a <a :href="uri">{{ uri }}</a></h3>
    </div>
    <div v-if="!logged && !token" class="account-container" @click="login">
      <div class="profilepic-container">
        <img v-if="currentUser?.userData?.profilePic" :src="currentUser?.userData?.profilePic" alt="">
        <font-awesome-icon v-else icon="fa-solid fa-user" />
      </div>
      <div class="data">
        Iniciar sesión
      </div>
    </div>
    <div v-if="logged" class="account-container" @click="selectAccount">
      <div class="profilepic-container">
        <img :src="profilePic">
      </div>
      <div class="data">
        {{ username }} <br>
        {{ email }}
      </div>
    </div>
  </div>
  <div v-if="!logged && token" class="loader-container">
    <Loader />
  </div>
</template>

<style scoped lang="scss" src="./ChooseAccount.component.scss"></style>