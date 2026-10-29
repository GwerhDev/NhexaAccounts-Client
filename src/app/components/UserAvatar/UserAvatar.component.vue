<script setup lang="ts">
import { computed, ref, watch } from 'vue';

// A user's photo, or their initials in a bordered circle when they have none (or it doesn't load).
const props = withDefaults(defineProps<{
  src?: string | null;
  name?: string | null;
  // Its width and height (any CSS length); the initials scale with it.
  size?: string;
  // The ring's width (any CSS length).
  border?: string;
}>(), { src: null, name: null, size: '2rem', border: '2px' });

const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });

// The first letter of the first two words: "Juan Pérez" → "JP", "Nhexa" → "N".
const initials = computed(() => {
  const words = (props.name ?? '').trim().split(/[\s._-]+/).filter(Boolean);
  return words.slice(0, 2).map(word => [...word][0]).join('').toUpperCase() || '?';
});

const style = computed(() => ({ '--avatar-size': props.size, '--avatar-border': props.border }));
</script>

<template>
  <img
    v-if="src && !failed"
    class="user-avatar"
    :style="style"
    :src="src"
    :alt="name ?? ''"
    data-testid="user-avatar-photo"
    @error="failed = true"
  />
  <span v-else class="user-avatar user-avatar--initials" :style="style" :title="name ?? undefined" data-testid="user-avatar-initials">
    {{ initials }}
  </span>
</template>

<style scoped lang="scss" src="./UserAvatar.component.scss" />
