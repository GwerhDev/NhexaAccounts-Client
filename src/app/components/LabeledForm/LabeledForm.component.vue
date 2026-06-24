<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ title: string; accordion?: boolean; initialOpen?: boolean }>();

const open = ref(props.initialOpen ?? !props.accordion);
</script>

<template>
  <div class="form-container">
    <div class="title-section" :class="{ 'title-accordion': accordion }" @click="accordion && (open = !open)">
      <div class="title-left">
        <font-awesome-icon
          v-if="accordion"
          class="accordion-chevron"
          :class="{ 'accordion-chevron--open': open }"
          icon="fa-solid fa-chevron-right"
        />
        <h2>{{ title }}</h2>
      </div>
      <div @click.stop="accordion && (open = true)">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="open" class="body-container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--components-background-alt);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  min-height: 3rem;
  background-color: var(--components-background);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;

  h2 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: 0.01em;
  }
}

.form-container:has(.body-container) .title-section {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.title-accordion {
  cursor: pointer;
  user-select: none;

  &:hover h2 {
    opacity: 0.75;
  }
}

.title-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.accordion-chevron {
  font-size: 0.7rem;
  opacity: 0.5;
  transition: transform 0.22s ease, opacity 0.15s;

  &--open {
    transform: rotate(90deg);
    opacity: 0.8;
  }
}

.body-container {
  gap: 1rem;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.ul-form {
  margin: 0;
  padding: 0;
  padding: 1rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
}

.edit-buttons-container {
  gap: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.cancel-button {
  background: rgb(71, 71, 71);

  &:hover {
    background: rgb(90, 90, 90);
    border-color: transparent;
  }
}
</style>
