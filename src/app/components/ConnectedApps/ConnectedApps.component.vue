<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../../../middlewares/store';
import { getConnectedApps, removeAccountApp, type ConnectedApp } from '../../../middlewares/services';
import { scopeLabel } from '../../../utils/oauthAuthorize';
import LabeledForm from '../LabeledForm/LabeledForm.component.vue';
import Modal from '../Modal/Modal.component.vue';
import { useToast } from '../../composables/useToast';

type LoadState = 'loading' | 'ready' | 'failed';

const store = useStore();
const toast = useToast();

// Two lists, each with its own state: one failing doesn't hide the other.
// Nhexa's apps: the catalog the apps menu shows too (a StreamBy export the browser reads).
const nhexaState = ref<LoadState>('loading');
const nhexaApps = computed(() => store.appList.flatMap(category => category.apps));
// The apps the user connected with their account (OAuth), from Nhexa-API.
const connectedState = ref<LoadState>('loading');
const connected = ref<ConnectedApp[]>([]);
const pendingRemoval = ref<ConnectedApp | null>(null);

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }) : null;

const loadNhexaApps = async () => {
  nhexaState.value = (await store.handleGetNhexaEnv()) ? 'ready' : 'failed';
};

const loadConnectedApps = async () => {
  const apps = await getConnectedApps();
  if (apps) connected.value = apps;
  connectedState.value = apps ? 'ready' : 'failed';
};

onMounted(() => {
  loadNhexaApps();
  loadConnectedApps();
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
      <LabeledForm title="Apps de Nhexa" accordion initial-open data-testid="nhexa-apps">
        <div v-if="nhexaState === 'loading'" class="apps-state">
          <div class="apps-spinner" />
        </div>
        <div v-else-if="nhexaState === 'failed'" class="apps-state" data-testid="nhexa-apps-error">
          <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="apps-empty-icon" />
          <p>No se pudieron cargar las aplicaciones de Nhexa.</p>
        </div>
        <div v-else-if="!nhexaApps.length" class="apps-state">
          <font-awesome-icon icon="fa-solid fa-layer-group" class="apps-empty-icon" />
          <p>No hay aplicaciones disponibles por el momento.</p>
        </div>
        <ul v-else class="apps-grid">
          <li v-for="item in nhexaApps" :key="item.url" data-testid="nhexa-app">
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
        <div v-if="connectedState === 'loading'" class="apps-state">
          <div class="apps-spinner" />
        </div>
        <p v-else-if="connectedState === 'failed'" class="status-msg" data-testid="connected-apps-error">No se pudieron cargar tus aplicaciones conectadas.</p>
        <p v-else-if="!connected.length" class="status-msg" data-testid="connected-apps-empty">No has conectado aplicaciones con tu cuenta de Nhexa.</p>
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
