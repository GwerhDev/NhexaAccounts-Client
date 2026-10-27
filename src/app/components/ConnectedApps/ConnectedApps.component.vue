<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAccountApps, removeAccountApp, type ConnectedApp, type NhexaAppCategory } from '../../../middlewares/services';
import { scopeLabel } from '../../../utils/oauthAuthorize';
import LabeledForm from '../LabeledForm/LabeledForm.component.vue';
import Modal from '../Modal/Modal.component.vue';
import { useToast } from '../../composables/useToast';

const toast = useToast();
const loading = ref(true);
const failed = ref(false);
const categories = ref<NhexaAppCategory[]>([]);
const connected = ref<ConnectedApp[]>([]);
const pendingRemoval = ref<ConnectedApp | null>(null);

const nhexaApps = computed(() => categories.value.flatMap(category => category.apps));

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }) : null;

onMounted(async () => {
  const apps = await getAccountApps();
  if (apps) {
    categories.value = apps.nhexa;
    connected.value = apps.connected;
  } else {
    failed.value = true;
  }
  loading.value = false;
});

const confirmRemoval = async () => {
  const app = pendingRemoval.value;
  pendingRemoval.value = null;
  if (!app) return;
  if (await removeAccountApp(app.clientId)) {
    connected.value = connected.value.filter(a => a.clientId !== app.clientId);
    toast.success(`${app.name} ya no tiene acceso a tu cuenta.`);
  } else {
    toast.error('No se pudo quitar el acceso.');
  }
};
</script>

<template>
  <section class="section-container">
    <div class="inner-container apps-sections">
      <div v-if="loading" class="apps-state">
        <div class="apps-spinner" />
      </div>

      <div v-else-if="failed" class="apps-state">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="apps-empty-icon" />
        <p>No se pudieron cargar tus aplicaciones.</p>
      </div>

      <template v-else>
        <LabeledForm title="Apps de Nhexa" accordion initial-open data-testid="nhexa-apps">
          <div v-if="!nhexaApps.length" class="apps-state">
            <font-awesome-icon icon="fa-solid fa-layer-group" class="apps-empty-icon" />
            <p>No hay aplicaciones disponibles por el momento.</p>
          </div>
          <ul v-else class="apps-grid">
            <li v-for="item in nhexaApps" :key="item.url">
              <a class="app-card" :href="item.url" target="_blank" :style="{ '--accent': item.color }">
                <span class="app-icon">
                  <img v-if="item.icon" :src="item.icon" :alt="item.label" />
                  <font-awesome-icon v-else icon="fa-solid fa-layer-group" />
                </span>
                <div class="app-info">
                  <span class="app-name">{{ item.label }}</span>
                  <span v-if="item.description" class="app-description">{{ item.description }}</span>
                </div>
                <font-awesome-icon icon="fa-solid fa-arrow-right" class="app-arrow" />
              </a>
            </li>
          </ul>
        </LabeledForm>

        <LabeledForm title="Apps conectadas" accordion initial-open data-testid="connected-apps">
          <p class="apps-description">Aplicaciones a las que diste acceso a tu cuenta de Nhexa. Si ya no usas alguna, quítale el acceso.</p>
          <p v-if="!connected.length" class="status-msg">No has conectado ninguna aplicación.</p>
          <ul v-else class="apps-grid">
            <li v-for="app in connected" :key="app.clientId" class="connected-app" data-testid="connected-app">
              <span class="app-icon">
                <img v-if="app.logoUri" :src="app.logoUri" :alt="app.name" />
                <font-awesome-icon v-else icon="fa-solid fa-cube" />
              </span>
              <div class="app-info">
                <span class="app-name">
                  {{ app.name }}
                  <span v-if="!app.verified" class="unverified-badge">No verificada</span>
                </span>
                <ul class="app-scopes">
                  <li v-for="scope in app.scopes" :key="scope">
                    <font-awesome-icon icon="fa-solid fa-check" />
                    {{ scopeLabel(scope) }}
                  </li>
                </ul>
                <span class="app-meta">
                  <template v-if="app.authorizedAt">Autorizada el {{ formatDate(app.authorizedAt) }}</template>
                  <template v-if="app.lastUsedAt"> · Último uso: {{ formatDate(app.lastUsedAt) }}</template>
                </span>
              </div>
              <button class="revoke-button" data-testid="remove-app" @click="pendingRemoval = app">Quitar acceso</button>
            </li>
          </ul>
        </LabeledForm>
      </template>
    </div>
  </section>

  <Modal
    v-if="pendingRemoval"
    title="Quitar acceso"
    confirm-label="Quitar acceso"
    danger
    @confirm="confirmRemoval"
    @cancel="pendingRemoval = null"
  >
    {{ pendingRemoval.name }} dejará de poder acceder a tu cuenta de inmediato. Si vuelve a pedir acceso, tendrás que autorizarla de nuevo.
  </Modal>
</template>
