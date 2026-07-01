<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from '../../middlewares/store';
import type { AccountDetail } from '../../middlewares/store';
import LabeledForm from '../components/LabeledForm/LabeledForm.component.vue';
import { useToast } from '../composables/useToast';

const store = useStore();
const toast = useToast();

const editAccount = ref(false);
const editDetail = ref(false);

// Local form state synced from store
const username = ref('');
const email = ref('');
const isVerified = computed(() => store.userDetail?.userData?.isVerified ?? false);
const detail = ref<AccountDetail>({ firstName: null, lastName: null, birthDate: null, countryId: null, phone: null, phoneCode: null, passwordSetAt: null });
const snapshot = ref<{ username: string; email: string; detail: AccountDetail }>({ username: '', email: '', detail: { ...detail.value } });

const syncFromStore = () => {
  const d = store.userDetail;
  if (!d) return;
  username.value = d.userData.username ?? '';
  email.value = d.userData.email ?? '';
  detail.value = { ...d.accountDetail };
  snapshot.value = { username: username.value, email: email.value, detail: { ...d.accountDetail } };
};

onMounted(async () => {
  await store.handleGetUserDetail();
  syncFromStore();
});

const saveAccount = async () => {
  const data = await store.handleUpdateUserDetail({ username: username.value, email: email.value });
  if (data?.userData) {
    syncFromStore();
    toast.success('Cambios guardados.');
  } else {
    toast.error('No se pudieron guardar los cambios.');
  }
  editAccount.value = false;
};

const cancelAccount = () => {
  username.value = snapshot.value.username;
  email.value = snapshot.value.email;
  editAccount.value = false;
};

const saveDetail = async () => {
  const data = await store.handleUpdateUserDetail({
    firstName: detail.value.firstName,
    lastName: detail.value.lastName,
    birthDate: detail.value.birthDate,
    countryId: detail.value.countryId,
    phone: detail.value.phone,
    phoneCode: detail.value.phoneCode,
  });
  if (data?.userData) {
    syncFromStore();
    toast.success('Cambios guardados.');
  } else {
    toast.error('No se pudieron guardar los cambios.');
  }
  editDetail.value = false;
};

const cancelDetail = () => {
  detail.value = { ...snapshot.value.detail };
  editDetail.value = false;
};
</script>

<template>
  <main class="main-container">
    <section class="section-container">
      <div class="inner-container">
        <ul class="card-container">
          <li>
            <LabeledForm title="Datos de la cuenta" accordion initial-open>
              <template #actions>
                <button v-if="!editAccount" class="edit-button" @click="editAccount = true">
                  <font-awesome-icon icon="fa-solid fa-edit" /> Actualizar
                </button>
              </template>
              <p class="section-description">Tu nombre de usuario e email identifican tu cuenta en el ecosistema NHEXA.</p>
              <form class="ul-form" @submit.prevent="saveAccount">
                <div class="info-grid">
                  <div class="field-group">
                    <label class="label-input">Nombre de usuario</label>
                    <input v-model="username" class="input-form" type="text" :readonly="!editAccount" />
                  </div>
                  <div class="field-group">
                    <label class="label-input">
                      Correo electrónico
                      <span class="verified-badge" :class="isVerified ? 'is-verified' : 'not-verified'">
                        <font-awesome-icon title="Verificado" :icon="isVerified ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'" />
                      </span>
                      <span class="email-info-tooltip" title="El correo electrónico no puede modificarse directamente. Contacta al soporte si necesitas cambiarlo.">
                        <font-awesome-icon icon="fa-solid fa-circle-info" />
                      </span>
                    </label>
                    <input v-model="email" class="input-form" type="email" :readonly="!editAccount" :disabled="editAccount" />
                  </div>
                </div>
                <div v-show="editAccount" class="edit-buttons-container">
                  <button type="submit">Guardar cambios</button>
                  <button type="button" class="cancel-button" @click="cancelAccount">Cancelar</button>
                </div>
              </form>
            </LabeledForm>
          </li>

          <li>
            <LabeledForm title="Información personal" accordion initial-open>
              <template #actions>
                <button v-if="!editDetail" class="edit-button" @click="editDetail = true">
                  <font-awesome-icon icon="fa-solid fa-edit" /> Actualizar
                </button>
              </template>
              <p class="section-description">Esta información es opcional y solo se usa para personalizar tu experiencia.</p>
              <form class="ul-form" @submit.prevent="saveDetail">
                <div class="info-grid">
                  <div class="field-group">
                    <label class="label-input">Nombre</label>
                    <input v-model="detail.firstName" class="input-form" type="text" :readonly="!editDetail" />
                  </div>
                  <div class="field-group">
                    <label class="label-input">Apellido</label>
                    <input v-model="detail.lastName" class="input-form" type="text" :readonly="!editDetail" />
                  </div>
                  <div class="field-group">
                    <label class="label-input">Fecha de nacimiento</label>
                    <input v-model="detail.birthDate" class="input-form" type="date" :readonly="!editDetail" />
                  </div>
                  <div class="field-group">
                    <label class="label-input">País</label>
                    <input v-model="detail.countryId" class="input-form" type="text" :readonly="!editDetail" />
                  </div>
                  <div class="field-group phone-group">
                    <div class="phone-row">
                      <span class="field-group w-auto">
                        <label class="label-input">Código</label>
                        <input v-model="detail.phoneCode" class="input-form" type="text" placeholder="+56" :readonly="!editDetail" />
                      </span>
                      <span class="field-group w-full">
                        <label class="label-input">Teléfono</label>
                        <input v-model="detail.phone" class="input-form" type="tel" :readonly="!editDetail" />
                      </span>
                    </div>
                  </div>
                </div>
                <div v-show="editDetail" class="edit-buttons-container">
                  <button type="submit">Guardar cambios</button>
                  <button type="button" class="cancel-button" @click="cancelDetail">Cancelar</button>
                </div>
              </form>
            </LabeledForm>
          </li>

        </ul>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 0.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.phone-row {
  display: flex;
  gap: 0.5rem;
}

.phone-code {
  flex-shrink: 0;
}

.phone-number {
  flex: 1;
}

.verified-badge {
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &.is-verified {
    color: var(--primary-color);
  }

  &.not-verified {
    color: rgba(255, 255, 255, 0.35);
  }
}

.email-info-tooltip {
  margin-left: 0.3rem;
  font-size: 0.75rem;
  opacity: 0.55;
  cursor: help;

  &:hover {
    opacity: 0.9;
  }
}

.section-description {
  font-size: 0.82rem;
  opacity: 0.55;
  margin: 0;
  padding: 0.5rem 1rem 0;
}

.saved-feedback {
  font-size: 0.8rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
</style>
