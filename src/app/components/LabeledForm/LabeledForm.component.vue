<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ title: string; accordion?: boolean; initialOpen?: boolean }>();

const open = ref(props.initialOpen ?? !props.accordion);

const onBeforeEnter = (el: Element) => {
  (el as HTMLElement).style.maxHeight = '0';
  (el as HTMLElement).style.opacity = '0';
};
const onEnter = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.transition = 'max-height 0.28s ease, opacity 0.2s ease';
  htmlEl.style.maxHeight = htmlEl.scrollHeight + 'px';
  htmlEl.style.opacity = '1';
  htmlEl.addEventListener('transitionend', done, { once: true });
};
const onAfterEnter = (el: Element) => {
  (el as HTMLElement).style.maxHeight = '';
  (el as HTMLElement).style.transition = '';
};
const onBeforeLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.maxHeight = htmlEl.scrollHeight + 'px';
  htmlEl.style.opacity = '1';
};
const onLeave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.transition = 'max-height 0.24s ease, opacity 0.18s ease';
  htmlEl.style.maxHeight = '0';
  htmlEl.style.opacity = '0';
  htmlEl.addEventListener('transitionend', done, { once: true });
};
</script>

<template>
  <div class="form-container" :class="{ 'form-container--open': open, 'form-container--accordion': accordion }">
    <div
      class="title-section"
      :class="{ 'title-accordion': accordion }"
      @click="accordion && (open = !open)"
    >
      <div class="title-left">
        <span v-if="accordion" class="accordion-chevron" :class="{ 'accordion-chevron--open': open }">
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </span>
        <h2>{{ title }}</h2>
      </div>
      <div @click.stop="accordion && (open = true)">
        <slot name="actions" />
      </div>
    </div>
    <Transition
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
    >
      <div v-if="open" class="body-container">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  border-radius: 0.6rem;
  overflow: hidden;
  background-color: var(--components-background-alt);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.2s;

  &--accordion.form-container--open {
    border-color: rgba(255, 255, 255, 0.08);
  }
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background-color: var(--components-background);
  backdrop-filter: blur(10px);
  min-height: 3rem;

  h2 {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    margin: 0;
    opacity: 0.9;
    transition: opacity 0.15s;
  }
}

.title-accordion {
  cursor: pointer;
  user-select: none;

  &:hover h2 {
    opacity: 0.65;
  }
}

.title-left {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.accordion-chevron {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  opacity: 0.45;
  transition: transform 0.25s ease, opacity 0.15s;
  will-change: transform;

  &--open {
    transform: rotate(90deg);
    opacity: 0.7;
  }
}

.body-container {
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.ul-form {
  margin: 0;
  padding: 1.25rem 1rem;
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
  gap: 0.75rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.07);
  border-color: transparent;
  color: rgba(229, 229, 229, 0.7);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: transparent;
  }
}
</style>
