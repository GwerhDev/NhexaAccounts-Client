<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  field: { label: string; value: string; type?: string };
  action: () => void;
}>();

const editActive = ref(false);

const handleEdit = () => {
  editActive.value = !editActive.value;
};

const handleAction = () => {
  props.action();
  editActive.value = false;
};
</script>

<template>
  <div class="form-container">
    <div class="title-section">
      <h2>{{ props.title }}</h2>
      <span>
        <button v-if="!editActive" class="edit-button" @click="handleEdit">
          <font-awesome-icon icon="fa-solid fa-edit" />
          Actualizar
        </button>
      </span>
    </div>
    <div class="body-container">
      <form class="ul-form" @submit.prevent="handleAction">
        <li>
          <label class="label-input">{{ props.field.label }}</label>
          <input
            v-model="props.field.value"
            class="input-form"
            :type="props.field.type || 'text'"
            :disabled="!editActive"
          />
        </li>
        <div v-show="editActive" class="edit-buttons-container">
          <button type="submit">Guardar cambios</button>
          <button type="button" class="cancel-button" @click="handleEdit">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./ActionTable.component.scss"></style>
