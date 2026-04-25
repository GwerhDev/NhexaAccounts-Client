<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDevices, revokeDevice, revokeAllDevices } from '../../../middlewares/services';
import LabeledForm from '../LabeledForm/LabeledForm.component.vue';

interface DeviceSession {
  id: string;
  user_agent: string | null;
  ip: string | null;
  created_at: string;
  expires_at: string;
}

const sessions = ref<DeviceSession[]>([]);
const loading = ref(true);

const parseAgent = (ua: string | null): string => {
  if (!ua) return 'Dispositivo desconocido';
  if (/Chrome/.test(ua) && !/Chromium|Edg/.test(ua)) return 'Google Chrome';
  if (/Firefox/.test(ua)) return 'Mozilla Firefox';
  if (/Edg/.test(ua)) return 'Microsoft Edge';
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  if (/OPR|Opera/.test(ua)) return 'Opera';
  return 'Navegador desconocido';
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

const load = async () => {
  loading.value = true;
  const data = await getDevices();
  sessions.value = data.sessions ?? [];
  loading.value = false;
};

const revoke = async (id: string) => {
  await revokeDevice(id);
  sessions.value = sessions.value.filter(s => s.id !== id);
};

const revokeAll = async () => {
  await revokeAllDevices();
  await load();
};

onMounted(load);
</script>

<template>
  <LabeledForm title="Dispositivos activos">
    <template #actions>
      <button v-if="sessions.length > 1" class="edit-button" @click="revokeAll">
        Cerrar otras sesiones
      </button>
    </template>
    <p v-if="loading" class="status-msg">Cargando sesiones...</p>
    <p v-else-if="sessions.length === 0" class="status-msg">No hay sesiones activas.</p>
    <ul v-else class="device-list">
      <li v-for="session in sessions" :key="session.id" class="device-item">
        <div class="device-info">
          <span class="device-name">{{ parseAgent(session.user_agent) }}</span>
          <span class="device-meta">{{ session.ip ?? 'IP desconocida' }} · {{ formatDate(session.created_at) }}</span>
        </div>
        <div class="button-container">
          <button class="revoke-button" @click="revoke(session.id)">Cerrar</button>
        </div>
      </li>
    </ul>
  </LabeledForm>
</template>

<style scoped lang="scss" src="./Devices.component.scss"></style>
