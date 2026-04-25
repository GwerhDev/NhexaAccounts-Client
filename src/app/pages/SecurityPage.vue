<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../../middlewares/store';
import { getPasswordStatus, updatePassword } from '../../middlewares/services';
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
import Devices from '../components/Devices/Devices.component.vue';

const store = useStore();
const email = computed(() => store.currentUser?.userData?.email ?? '');

interface PasswordStatus {
  passwordSetAt: string | null;
}

const passwordStatus = ref<PasswordStatus | null>(null);
const password = ref('');
const confirm = ref('');
const editPassword = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (mins < 1)    return 'hace unos segundos';
  if (mins < 60)   return `hace ${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;
  if (hours < 24)  return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days < 7)    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  if (weeks < 5)   return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
};

const mismatch = computed(() => confirm.value.length > 0 && password.value !== confirm.value);
const canSubmit = computed(() => password.value.length >= 8 && password.value === confirm.value);

onMounted(async () => {
  passwordStatus.value = await getPasswordStatus();
});

const savePassword = async () => {
  if (!canSubmit.value) return;
  await updatePassword(password.value);
  password.value = '';
  confirm.value = '';
  showPassword.value = false;
  showConfirm.value = false;
  editPassword.value = false;
  passwordStatus.value = await getPasswordStatus();
};

const cancelPassword = () => {
  password.value = '';
  confirm.value = '';
  showPassword.value = false;
  showConfirm.value = false;
  editPassword.value = false;
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
                  {{ passwordStatus?.passwordSetAt ? 'Actualizar' : 'Configurar' }}
                </button>
              </template>
              <form class="ul-form" @submit.prevent="savePassword">
                <li v-if="!editPassword">
                  <p class="status-msg">
                    {{ passwordStatus?.passwordSetAt ? `Contraseña configurada · Actualizada ${timeAgo(passwordStatus.passwordSetAt)}` : 'No tienes contraseña configurada.' }}
                  </p>
                </li>
                <template v-if="editPassword">
                  <input type="text" autocomplete="username" :value="email" aria-hidden="true" readonly tabindex="-1" class="visually-hidden" />
                  <div class="info-grid">
                    <div class="field-group">
                      <label class="label-input">Nueva contraseña</label>
                      <div class="input-reveal">
                        <input v-model="password" class="input-form" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" />
                        <button type="button" class="reveal-btn" @click="showPassword = !showPassword" tabindex="-1">
                          <font-awesome-icon :icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
                        </button>
                      </div>
                    </div>
                    <div class="field-group">
                      <label class="label-input">Confirmar contraseña</label>
                      <div class="input-reveal">
                        <input v-model="confirm" class="input-form" :class="{ 'input-error': mismatch }" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" />
                        <button type="button" class="reveal-btn" @click="showConfirm = !showConfirm" tabindex="-1">
                          <font-awesome-icon :icon="showConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
                        </button>
                      </div>
                      <span v-if="mismatch" class="field-error">Las contraseñas no coinciden.</span>
                    </div>
                  </div>
                  <div class="edit-buttons-container">
                    <button type="submit" :disabled="!canSubmit">Guardar cambios</button>
                    <button type="button" class="cancel-button" @click="cancelPassword">Cancelar</button>
                  </div>
                </template>
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

<style lang="scss">
.input-reveal {
  position: relative;
  display: flex;
  align-items: center;

  .input-form {
    flex: 1;
    padding-right: 2.5rem;
  }

  .reveal-btn {
    position: absolute;
    right: 0.6rem;
    background: none;
    border: none;
    padding: 0;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    font-size: 0.85rem;
    line-height: 1;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
      background: none;
      border-color: transparent;
    }

    &:focus-visible {
      outline: none;
    }
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.input-error {
  border-color: #c0392b !important;
}

.field-error {
  margin-top: 0.25rem;
  font-size: 0.72rem;
  color: #e74c3c;
}
</style>
