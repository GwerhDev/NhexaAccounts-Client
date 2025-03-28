<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '../../../middlewares/store/index';
import defaultImage from '../../../assets/svg/user-icon.svg';

const store: any = useStore();
const currentUser: any = computed(() => store.currentUser);

let logged: any = computed(() => currentUser.value.logged);
let id: any = computed(() => currentUser.value.userData?._id);
let email: any = computed(() => currentUser.value.userData?.email);
let username: any = computed(() => currentUser.value.userData?.username);
let profilePic: any = computed(() => currentUser.value.userData?.profilePic ?? defaultImage);

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
    await store.handleUpdateUserData(formData, id.value);
    editActive.value = !editActive.value;
    if (!profilePic) profilePic = defaultImage;
  } catch (error) {
    console.error(error)
  }
}

</script>

<template>
  <div class="container-default">
    <div class="form-container">
      <div class="title-section">
        <h2>Datos del usuario</h2>
        <span>
          <button v-if="!editActive" class="edit-button" @click="activeEdit">
            <font-awesome-icon icon="fa-solid fa-edit" />
            Actualizar
          </button>
        </span>
      </div>
      <div class="personal-data-container">
        <div v-if="!logged" class="loader"></div>
        <form class="ul-form" v-if="logged">
          <li>
            <label>Nombre de usuario</label>
            <input v-model="username" class="input-form" type="text" :disabled="!editActive" />
          </li>
          <li>
            <label>Correo electrónico</label>
            <input v-model="email" class="input-form" type="email" :disabled="!editActive" />
          </li>
          <div v-show="showSaveCancelButtons" class="edit-buttons-container">
            <button @click="handleUpdate">Guardar cambios</button>
            <button class="cancel-button" @click="activeEdit">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./AccountSettings.component.scss"></style>