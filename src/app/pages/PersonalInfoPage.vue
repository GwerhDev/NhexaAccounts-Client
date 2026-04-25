<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from '../../middlewares/store';
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';

const store = useStore();
const id = computed(() => store.currentUser?.userData?.id);

const username = ref('');
const editUsername = ref(false);

const email = ref('');
const editEmail = ref(false);

watch(() => store.currentUser?.userData, (u) => {
  if (!u) return;
  username.value = u.username ?? '';
  email.value = u.email ?? '';
}, { immediate: true });

const save = async (key: string, value: string, done: () => void) => {
  await store.handleUpdateUserData({ [key]: value }, id.value);
  done();
};
</script>

<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <LabeledForm title="Datos personales">
              <template #actions>
                <button v-if="!editUsername" class="edit-button" @click="editUsername = true">
                  <font-awesome-icon icon="fa-solid fa-edit" /> Actualizar
                </button>
              </template>
              <form class="ul-form" @submit.prevent="save('username', username, () => editUsername = false)">
                <li>
                  <label class="label-input">Nombre de usuario</label>
                  <input v-model="username" class="input-form" type="text" :disabled="!editUsername" />
                </li>
                <div v-show="editUsername" class="edit-buttons-container">
                  <button type="submit">Guardar cambios</button>
                  <button type="button" class="cancel-button" @click="editUsername = false">Cancelar</button>
                </div>
              </form>
            </LabeledForm>
          </li>
          <li>
            <LabeledForm title="Email">
              <template #actions>
                <button v-if="!editEmail" class="edit-button" @click="editEmail = true">
                  <font-awesome-icon icon="fa-solid fa-edit" /> Actualizar
                </button>
              </template>
              <form class="ul-form" @submit.prevent="save('email', email, () => editEmail = false)">
                <li>
                  <label class="label-input">Correo electrónico</label>
                  <input v-model="email" class="input-form" type="text" :disabled="!editEmail" />
                </li>
                <div v-show="editEmail" class="edit-buttons-container">
                  <button type="submit">Guardar cambios</button>
                  <button type="button" class="cancel-button" @click="editEmail = false">Cancelar</button>
                </div>
              </form>
            </LabeledForm>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
