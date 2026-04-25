<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPasswordStatus, updatePassword } from '../../middlewares/services';
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
import Devices from '../components/Devices/Devices.component.vue';

interface PasswordStatus {
  hasPassword: boolean;
}

const passwordStatus = ref<PasswordStatus | null>(null);
const password = ref('');
const editPassword = ref(false);

onMounted(async () => {
  passwordStatus.value = await getPasswordStatus();
});

const savePassword = async () => {
  await updatePassword(password.value);
  password.value = '';
  editPassword.value = false;
  passwordStatus.value = await getPasswordStatus();
};
</script>

<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <LabeledForm title="Contraseña">
              <template #actions>
                <button v-if="!editPassword" class="edit-button" @click="editPassword = true">
                  <font-awesome-icon icon="fa-solid fa-edit" />
                  {{ passwordStatus?.hasPassword ? 'Actualizar' : 'Configurar' }}
                </button>
              </template>
              <form class="ul-form" @submit.prevent="savePassword">
                <li v-if="!editPassword">
                  <p class="status-msg">
                    {{ passwordStatus?.hasPassword ? 'Contraseña configurada.' : 'No tienes contraseña configurada.' }}
                  </p>
                </li>
                <li v-show="editPassword">
                  <label class="label-input">Nueva contraseña</label>
                  <input v-model="password" class="input-form" type="password" />
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
