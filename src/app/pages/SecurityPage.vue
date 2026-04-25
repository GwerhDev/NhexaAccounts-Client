<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../../middlewares/store';
import {
  getPasswordStatus,
  updatePassword,
  getTwoFactorSetup,
  enableTwoFactor,
  disableTwoFactor,
} from '../../middlewares/services';
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
import Devices from '../components/Devices/Devices.component.vue';
import OtpInput from '../components/OtpInput/OtpInput.component.vue';

const store = useStore();
const email = computed(() => store.currentUser?.userData?.email ?? '');

interface SecurityStatus {
  passwordSetAt: string | null;
  twoFactorEnabled: boolean;
}

const status = ref<SecurityStatus>({ passwordSetAt: null, twoFactorEnabled: false });

// Password
const password = ref('');
const confirm = ref('');
const editPassword = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const mismatch = computed(() => confirm.value.length > 0 && password.value !== confirm.value);
const canSubmit = computed(() => password.value.length >= 8 && password.value === confirm.value);

// 2FA
type TwoFactorStep = 'idle' | 'qr' | 'backup-codes' | 'disable-confirm';
const tfaStep = ref<TwoFactorStep>('idle');
const tfaSecret = ref('');
const tfaQr = ref('');
const tfaBackupCodes = ref<string[]>([]);
const tfaError = ref('');
const otpEnableRef = ref<InstanceType<typeof OtpInput> | null>(null);
const otpDisableRef = ref<InstanceType<typeof OtpInput> | null>(null);

const startSetup2FA = async () => {
  tfaError.value = '';
  const data = await getTwoFactorSetup();
  if (!data) return;
  tfaSecret.value = data.secret;
  tfaQr.value = data.qrDataUrl;
  tfaStep.value = 'qr';
};

const confirmEnable2FA = async (code: string) => {
  tfaError.value = '';
  const result = await enableTwoFactor(tfaSecret.value, code);
  if (result?.error || !result?.backupCodes) {
    tfaError.value = result?.message ?? 'Código inválido.';
    otpEnableRef.value?.reset();
    return;
  }
  tfaBackupCodes.value = result.backupCodes;
  tfaStep.value = 'backup-codes';
  status.value = await getPasswordStatus();
};

const finishSetup2FA = () => {
  tfaStep.value = 'idle';
  tfaBackupCodes.value = [];
  tfaSecret.value = '';
  tfaQr.value = '';
};

const confirmDisable2FA = async (code: string) => {
  tfaError.value = '';
  const result = await disableTwoFactor(code);
  if (result?.error || !result?.success) {
    tfaError.value = result?.message ?? 'Código inválido.';
    otpDisableRef.value?.reset();
    return;
  }
  tfaStep.value = 'idle';
  status.value = await getPasswordStatus();
};

const cancelTfa = () => {
  tfaStep.value = 'idle';
  tfaError.value = '';
};

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

onMounted(async () => {
  status.value = await getPasswordStatus();
});

const savePassword = async () => {
  if (!canSubmit.value) return;
  await updatePassword(password.value);
  password.value = '';
  confirm.value = '';
  showPassword.value = false;
  showConfirm.value = false;
  editPassword.value = false;
  status.value = await getPasswordStatus();
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

          <!-- Columna izquierda: Contraseña + Dispositivos -->
          <li class="card-column">
            <LabeledForm title="Contraseña" accordion>
              <template #actions>
                <button v-if="!editPassword" class="edit-button" @click="editPassword = true">
                  <font-awesome-icon icon="fa-solid fa-edit" />
                  {{ status.passwordSetAt ? 'Actualizar' : 'Configurar' }}
                </button>
              </template>
              <form class="ul-form" @submit.prevent="savePassword">
                <li v-if="!editPassword">
                  <p class="status-msg">
                    {{ status.passwordSetAt ? `Contraseña configurada · Actualizada ${timeAgo(status.passwordSetAt)}` : 'No tienes contraseña configurada.' }}
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
            <Devices />
          </li>

          <!-- Columna derecha: 2FA -->
          <li class="card-column">
            <LabeledForm title="Verificación en dos pasos" accordion>
              <template #actions>
                <button
                  v-if="tfaStep === 'idle' && !status.twoFactorEnabled"
                  class="edit-button"
                  @click="startSetup2FA"
                >
                  <font-awesome-icon icon="fa-solid fa-shield-halved" />
                  Activar
                </button>
                <button
                  v-if="tfaStep === 'idle' && status.twoFactorEnabled"
                  class="edit-button edit-button--danger"
                  @click="tfaStep = 'disable-confirm'"
                >
                  <font-awesome-icon icon="fa-solid fa-shield-halved" />
                  Desactivar
                </button>
              </template>

              <div v-if="tfaStep === 'idle'" class="ul-form">
                <p class="status-msg">
                  <font-awesome-icon
                    :icon="status.twoFactorEnabled ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                    :style="{ color: status.twoFactorEnabled ? 'var(--app-white)' : 'rgba(255,255,255,0.35)' }"
                  />
                  {{ status.twoFactorEnabled ? 'Habilitado · Tu cuenta tiene protección extra.' : 'Deshabilitado · Activa 2FA para mayor seguridad.' }}
                </p>
              </div>

              <div v-else-if="tfaStep === 'qr'" class="ul-form tfa-setup">
                <p class="status-msg">Escanea el código QR con Google Authenticator o Authy, luego ingresa el código de 6 dígitos.</p>
                <img :src="tfaQr" alt="QR 2FA" class="tfa-qr" />
                <p class="tfa-secret-hint">Clave manual: <code>{{ tfaSecret }}</code></p>
                <div class="field-group">
                  <OtpInput ref="otpEnableRef" @complete="confirmEnable2FA" />
                  <span v-if="tfaError" class="field-error">{{ tfaError }}</span>
                </div>
                <button type="button" class="cancel-button" style="align-self: flex-start" @click="cancelTfa">Cancelar</button>
              </div>

              <div v-else-if="tfaStep === 'backup-codes'" class="ul-form tfa-setup">
                <p class="status-msg"><strong>2FA activado.</strong> Guarda estos códigos de respaldo en un lugar seguro. Solo se muestran una vez.</p>
                <ul class="backup-codes-grid">
                  <li v-for="code in tfaBackupCodes" :key="code" class="backup-code">{{ code }}</li>
                </ul>
                <div class="edit-buttons-container">
                  <button type="button" @click="finishSetup2FA">Listo</button>
                </div>
              </div>

              <div v-else-if="tfaStep === 'disable-confirm'" class="ul-form tfa-setup">
                <p class="status-msg">Ingresa tu código de autenticación o un código de respaldo para desactivar 2FA.</p>
                <div class="field-group">
                  <OtpInput ref="otpDisableRef" @complete="confirmDisable2FA" />
                  <span v-if="tfaError" class="field-error">{{ tfaError }}</span>
                </div>
                <button type="button" class="cancel-button" style="align-self: flex-start" @click="cancelTfa">Cancelar</button>
              </div>
            </LabeledForm>
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

.edit-button--danger {
  color: #e74c3c !important;
  &:hover { background: rgba(231, 76, 60, 0.12) !important; }
}

.tfa-setup {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tfa-qr {
  width: 180px;
  height: 180px;
  border-radius: 8px;
}

.tfa-secret-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);

  code {
    font-family: monospace;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.04em;
  }
}

.backup-codes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.backup-code {
  font-family: monospace;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}
</style>
