<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDevices, revokeDevice, revokeAllDevices } from '../../../middlewares/services';
import LabeledForm from '../LabeledForm/LabeledForm.component.vue';
import Modal from '../Modal/Modal.component.vue';

interface DeviceSession {
  id: string;
  user_agent: string | null;
  ip: string | null;
  created_at: string;
  expires_at: string;
  isCurrent: boolean;
  device: {
    browser: string;
    os: string | null;
    type: string;
  };
}

const sessions = ref<DeviceSession[]>([]);
const loading = ref(true);

const pendingRevokeId = ref<string | null>(null);
const showRevokeAllModal = ref(false);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

const load = async () => {
  loading.value = true;
  const data = await getDevices();
  sessions.value = data.sessions ?? [];
  loading.value = false;
};

const confirmRevoke = async () => {
  if (!pendingRevokeId.value) return;
  await revokeDevice(pendingRevokeId.value);
  sessions.value = sessions.value.filter(s => s.id !== pendingRevokeId.value);
  pendingRevokeId.value = null;
};

const confirmRevokeAll = async () => {
  showRevokeAllModal.value = false;
  await revokeAllDevices();
  await load();
};

onMounted(load);
</script>

<template>
  <LabeledForm title="Dispositivos activos" accordion>
    <template #actions>
      <button v-if="sessions.length > 1" class="edit-button" @click="showRevokeAllModal = true">
        Cerrar otras sesiones
      </button>
    </template>
    <p class="device-description">Estos son los dispositivos con una sesión activa en tu cuenta. Si no reconoces alguno, ciérralo de inmediato.</p>
    <p v-if="loading" class="status-msg">Cargando sesiones...</p>
    <p v-else-if="sessions.length === 0" class="status-msg">No hay sesiones activas.</p>
    <ul v-else class="device-list">
      <li v-for="session in sessions" :key="session.id" class="device-item">
        <div class="device-icon">
          <font-awesome-icon
            :icon="session.device.type === 'mobile' ? 'fa-solid fa-mobile-screen' : session.device.type === 'tablet' ? 'fa-solid fa-tablet-screen-button' : 'fa-solid fa-desktop'"
          />
        </div>
        <div class="device-info">
          <span class="device-name">
            {{ session.device.browser }}
            <span v-if="session.isCurrent" class="current-badge">Esta sesión</span>
          </span>
          <span class="device-meta">
            {{ session.device.os ?? 'OS desconocido' }} · {{ session.ip ?? 'IP desconocida' }} · {{ formatDate(session.created_at) }}
          </span>
        </div>
        <div class="button-container">
          <button v-if="!session.isCurrent" class="revoke-button" @click="pendingRevokeId = session.id">Cerrar</button>
        </div>
      </li>
    </ul>
  </LabeledForm>

  <Modal
    v-if="pendingRevokeId"
    title="Cerrar sesión"
    confirm-label="Cerrar sesión"
    danger
    @confirm="confirmRevoke"
    @cancel="pendingRevokeId = null"
  >
    ¿Estás seguro de que querés cerrar esta sesión? El dispositivo perderá el acceso a tu cuenta de inmediato.
  </Modal>

  <Modal
    v-if="showRevokeAllModal"
    title="Cerrar otras sesiones"
    confirm-label="Cerrar todas"
    danger
    @confirm="confirmRevokeAll"
    @cancel="showRevokeAllModal = false"
  >
    Esto cerrará todas las sesiones activas excepto la actual. Los demás dispositivos perderán el acceso de inmediato.
  </Modal>
</template>

<style scoped lang="scss" src="./Devices.component.scss"></style>
