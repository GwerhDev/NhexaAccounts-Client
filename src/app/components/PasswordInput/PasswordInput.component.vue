<script setup lang="ts">
import { ref } from 'vue';

// A password field with the eye that shows what's typed. `autocomplete` tells the browser's
// password manager which password it is: 'current-password' to log in, 'new-password' to set one.
defineProps<{
  modelValue: string;
  autocomplete: 'current-password' | 'new-password';
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const shown = ref(false);
</script>

<template>
  <div class="password-input">
    <input
      :value="modelValue"
      class="input-form"
      :class="{ 'input-error': invalid }"
      :type="shown ? 'text' : 'password'"
      :name="name"
      :autocomplete="autocomplete"
      :disabled="disabled"
      required
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      type="button"
      class="reveal-btn"
      tabindex="-1"
      :disabled="disabled"
      :aria-label="shown ? 'Ocultar contraseña' : 'Mostrar contraseña'"
      @click="shown = !shown"
    >
      <font-awesome-icon :icon="shown ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
    </button>
  </div>
</template>

<style scoped lang="scss" src="./PasswordInput.component.scss" />
