<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../../../middlewares/store/index';
import { closeAccountMenu } from '../../../helpers/menu';
import defaultImage from '../../../assets/svg/user-icon.svg';

const store: any = useStore();
const currentUser: any = computed(() => store.currentUser);

let logged: any = computed(() => currentUser.value.logged);
let token: any = computed(() => currentUser.value.token);
let id: any = computed(() => currentUser.value.userData?.id);
let email: any = computed(() => currentUser.value.userData?.email);
let username: any = computed(() => currentUser.value.userData?.username);
let profilePic: any = computed(() => currentUser.value.userData?.profilePic ?? defaultImage);
token && store.handleUserData(token);

const editActive: any = ref(false);
const showSaveCancelButtons: any = computed(() => editActive.value);

function activeEdit(e: any) {
  e.preventDefault();
  editActive.value = !editActive.value;
  email = currentUser.value.userData?.email;
  username = currentUser.value.userData?.username;
  profilePic = currentUser.value.userData?.profilePic ?? defaultImage;
}

async function handleUpdate(e: any) {
  e.preventDefault();
  if (profilePic === defaultImage) { profilePic = null };
  const formData: any = { username, email, profilePic };

  try {
    await store.handleUpdateUserData(formData, id.value, token);
    editActive.value = !editActive.value;
    if (!profilePic) profilePic = defaultImage;
  } catch (error) {
    console.error(error)
  }
}

function handleFileUpload(e: any) {
  const file: any = e.target.files[0];
  const reader: any = new FileReader();
  reader.onloadend = (e: any) => {
    const pic: any = e.target.result;
    const imageSrc: any = pic;
    profilePic = imageSrc;
  }

  reader.readAsDataURL(file);
}

function logout() { 
  store.logout(); 
  closeAccountMenu();
};

</script>

<template>
  <div class="form-container">
    <div class="profile-pic-container">
      <img class="profile-pic" :src="profilePic" alt="" width="150">
    </div>
    <input v-if="editActive" @input="handleFileUpload" type="file" />
    <h2>Datos del usuario</h2>
    <div v-if="!logged" class="loader"></div>
    <form class="ul-form" v-if="logged">
      <li class="li-form">
        <label>Nombre de usuario</label>
        <input v-model="username" class="input-form" type="text" :disabled="!editActive" />
      </li>
      <li class="li-form">
        <label>Correo electrónico</label>
        <input v-model="email" class="input-form" type="email" :disabled="!editActive" />
      </li>
      <button v-if="!editActive" class="submit-button" @click="activeEdit">Editar mi información</button>
      <div v-show="showSaveCancelButtons" class="edit-buttons-container">
        <button @click="handleUpdate">Guardar cambios</button>
        <button class="cancel-button" @click="activeEdit">Cancelar</button>
      </div>
    </form>
    <router-link class="logout-button" to='/' @click="logout">
      Cerrar sesión
    </router-link>
  </div>
</template>

<style scoped lang="scss" src="./AccountSettings.component.scss"></style>