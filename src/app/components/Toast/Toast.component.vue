<script setup lang="ts">
import { useToast } from '../../composables/useToast';

const { toasts, remove } = useToast();

const iconFor = (type: string) => {
  if (type === 'success') return 'fa-solid fa-circle-check';
  if (type === 'error') return 'fa-solid fa-circle-xmark';
  return 'fa-solid fa-circle-info';
};
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="`toast--${t.type}`"
        >
          <font-awesome-icon :icon="iconFor(t.type)" class="toast-icon" />
          <span class="toast-msg">{{ t.message }}</span>
          <button class="toast-close" @click="remove(t.id)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
          <div class="toast-progress" :style="{ animationDuration: t.duration + 'ms' }" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" src="./Toast.component.scss" />
