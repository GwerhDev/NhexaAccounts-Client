<script setup lang="ts">
import { ref, nextTick } from 'vue';

const emit = defineEmits<{ complete: [code: string] }>();

const digits = ref<string[]>(Array(6).fill(''));
const inputs = ref<HTMLInputElement[]>([]);

const value = () => digits.value.join('');

const focus = (i: number) => nextTick(() => inputs.value[i]?.focus());

const onInput = (i: number, e: Event) => {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  digits.value[i] = raw.slice(-1);
  (e.target as HTMLInputElement).value = digits.value[i];

  if (digits.value[i] && i < 5) {
    focus(i + 1);
  }

  if (digits.value.every(d => d)) {
    emit('complete', value());
  }
};

const onKeydown = (i: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    digits.value[i - 1] = '';
    focus(i - 1);
  }
};

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
  pasted.split('').forEach((char, i) => { digits.value[i] = char; });
  const next = Math.min(pasted.length, 5);
  focus(next);
  if (pasted.length === 6) emit('complete', pasted);
};

const reset = () => {
  digits.value = Array(6).fill('');
  focus(0);
};

defineExpose({ reset });
</script>

<template>
  <div class="otp-container">
    <input
      v-for="(_, i) in digits"
      :key="i"
      :ref="el => { if (el) inputs[i] = el as HTMLInputElement }"
      class="otp-input"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digits[i]"
      autocomplete="one-time-code"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @paste="onPaste"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>

<style scoped lang="scss">
.otp-container {
  display: flex;
  gap: 0.5rem;
}

.otp-input {
  width: 2.75rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0;
  border-radius: 6px;
  caret-color: transparent;
}
</style>
