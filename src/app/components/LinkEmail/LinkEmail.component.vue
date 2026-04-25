<script setup lang="ts">
import { ref } from 'vue';
import { linkEmail } from '../../../middlewares/services';
import LabeledForm from '../LabeledForm/LabeledForm.component.vue';

const password = ref('');
const confirm = ref('');
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const errorMsg = ref('');

const emit = defineEmits<{ linked: [] }>();

const submit = async () => {
  errorMsg.value = '';
  if (password.value.length < 8) {
    errorMsg.value = 'La contraseña debe tener al menos 8 caracteres.';
    return;
  }
  if (password.value !== confirm.value) {
    errorMsg.value = 'Las contraseñas no coinciden.';
    return;
  }
  status.value = 'loading';
  const res = await linkEmail(password.value);
  if (res?.success) {
    status.value = 'success';
    emit('linked');
  } else {
    status.value = 'error';
    errorMsg.value = res?.message ?? 'Error al vincular la contraseña.';
  }
};
</script>

<template>
  <LabeledForm title="Vincular correo electrónico">
    <p v-if="status === 'success'" class="success-msg">
      Contraseña establecida. Ya puedes iniciar sesión con tu correo.
    </p>
    <form v-else class="ul-form" @submit.prevent="submit">
      <li>
        <label class="label-input">Nueva contraseña</label>
        <input v-model="password" class="input-form" type="password" placeholder="Mínimo 8 caracteres" />
      </li>
      <li>
        <label class="label-input">Confirmar contraseña</label>
        <input v-model="confirm" class="input-form" type="password" placeholder="Repite la contraseña" />
      </li>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <div class="edit-buttons-container">
        <button type="submit" :disabled="status === 'loading'">
          {{ status === 'loading' ? 'Guardando...' : 'Establecer contraseña' }}
        </button>
      </div>
    </form>
  </LabeledForm>
</template>

<style scoped lang="scss" src="./LinkEmail.component.scss"></style>
