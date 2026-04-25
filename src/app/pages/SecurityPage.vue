<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from '../../middlewares/store';
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
import Devices from '../components/Devices/Devices.component.vue';

const store = useStore();
const id = computed(() => store.currentUser?.userData?.id);
const hasPassword = computed(() => store.currentUser?.userData?.hasPassword);

const password = ref('');
const editPassword = ref(false);

watch(() => store.currentUser?.userData, (u) => {
  if (!u) return;
  password.value = '';
}, { immediate: true });

const savePassword = async () => {
  await store.handleUpdateUserData({ password: password.value }, id.value);
  password.value = '';
  editPassword.value = false;
};
</script>

<template>
  <main class="main-container">
    <section class="section-container" v-if="hasPassword">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <LabeledForm title="Contraseña">
              <template #actions>
                <button v-if="!editPassword" class="edit-button" @click="editPassword = true">
                  <font-awesome-icon icon="fa-solid fa-edit" /> Actualizar
                </button>
              </template>
              <form class="ul-form" @submit.prevent="savePassword">
          <li>
            <label class="label-input">Nueva contraseña</label>
            <input v-model="password" class="input-form" type="password" :disabled="!editPassword" />
          </li>

          <div v-show="editPassword" class="edit-buttons-container">
            <button type="submit">Guardar cambios</button>
            <button type="button" class="cancel-button" @click="editPassword = false">Cancelar</button>
          </div>
          </form>
          </LabeledForm>
          </li>
          <li>
            <Devices />
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
