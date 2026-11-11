<style scoped lang="scss" src="./AppLaunch.component.scss" />
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { runLaunch, type SplashKind } from './appLaunch';

const props = defineProps<{
  kind: SplashKind;
  // Where it opens from (the hexagon chosen's center, px of the viewport).
  from: { x: number; y: number };
}>();
// Its splash's background covers the screen: the app can be opened now.
const emit = defineEmits<{ done: [] }>();

const base = ref<HTMLCanvasElement | null>(null);
const sparks = ref<HTMLCanvasElement | null>(null);
let stop = () => {};

onMounted(() => {
  if (!base.value || !sparks.value) { emit('done'); return; }
  stop = runLaunch(base.value, sparks.value, props.kind, props.from, () => emit('done'));
});
onBeforeUnmount(() => stop());
</script>

<template>
  <!-- What's on screen comes undone into the chosen app's splash background (see appLaunch). -->
  <Teleport to="body">
    <div class="app-launch" data-testid="app-launch" :data-kind="kind" aria-hidden="true">
      <canvas ref="base" class="layer" />
      <canvas ref="sparks" class="layer sparks" />
    </div>
  </Teleport>
</template>
