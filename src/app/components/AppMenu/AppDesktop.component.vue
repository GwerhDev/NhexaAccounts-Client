<style scoped>
.app-desktop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(115, 165, 204, 0.10), transparent 55%),
    rgba(12, 14, 18, 0.92);
  backdrop-filter: blur(6px);
}

.app-launcher {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1.25rem;
  max-width: 760px;
  padding: 0 1rem;
}

/* Each app is a hexagon (flat top), and those of a category fit together as a honeycomb strip:
   every other one half a hexagon lower, each one a quarter of its width over the last.
   Each app is a hexagon, its corners slightly rounded: a mask (--nhexa-desktop-hex-*) cuts its
   face, and its border, a hexagon behind the face. The button itself isn't masked: its glow
   (drop shadows of what it draws, so shaped as the hexagon) isn't cut off. */
.app-item {
  --hex-w: 150px;
  --hex-h: calc(var(--hex-w) * 0.866);
  --hex-gap: 6px;
  --hex-face-color: var(--components-background-solid);
  width: var(--hex-w);
  height: var(--hex-h);
  position: relative;
  padding: 1.5px;
  border: none;
  border-radius: 0;
  background: transparent;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  /* At rest: no glow (the same filters, nothing in them, so the glow can grow out of it). */
  filter: drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent) brightness(1);
  transition:
    filter var(--nhexa-desktop-glow-duration) var(--nhexa-desktop-glow-ease),
    transform var(--nhexa-desktop-glow-duration) var(--nhexa-desktop-glow-ease);
}

/* Its border: the hexagon, behind its face. */
.app-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.07);
  -webkit-mask: var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat;
  mask: var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat;
  transition: background-color var(--nhexa-desktop-glow-duration) var(--nhexa-desktop-glow-ease);
}

/* The keyboard's focus: a ring around the hexagon, following its shape (the hexagon, a little
   bigger, its middle cut out). */
.app-item::after {
  content: '';
  position: absolute;
  inset: calc(-2 * var(--nhexa-desktop-focus-ring));
  background: var(--app-color);
  -webkit-mask:
    var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat,
    var(--nhexa-desktop-hex-flat) center / calc(100% - 2 * var(--nhexa-desktop-focus-ring)) calc(100% - 2 * var(--nhexa-desktop-focus-ring)) no-repeat;
  -webkit-mask-composite: xor;
  mask:
    var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat,
    var(--nhexa-desktop-hex-flat) center / calc(100% - 2 * var(--nhexa-desktop-focus-ring)) calc(100% - 2 * var(--nhexa-desktop-focus-ring)) no-repeat;
  mask-composite: exclude;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--nhexa-desktop-glow-duration) var(--nhexa-desktop-glow-ease);
}

.app-face {
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  /* A faint sheen across its face. */
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.06), transparent 45%),
    var(--hex-face-color);
  -webkit-mask: var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat;
  mask: var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat;
  gap: 0.35rem;
  padding: 0 22%;
}

.app-face::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--app-color);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--nhexa-desktop-glow-duration) var(--nhexa-desktop-glow-ease);
}

.app-face::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.18) 50%, transparent 65%);
  background-size: 300% 100%;
  background-position: 200% center;
  pointer-events: none;
  opacity: 0;
}

/* Hovered, or focused from the keyboard: it lifts and its glow rises. (The button itself never
   takes a fill: an app's own button hover would paint its whole box.) */
.app-item:hover,
.app-item:focus-visible,
.app-item:active {
  background: transparent;
}

.app-item:hover,
.app-item:focus-visible {
  transform: translateY(-4px);
  filter:
    drop-shadow(0 0 var(--nhexa-desktop-glow-wide) var(--nhexa-desktop-glow-soft))
    drop-shadow(0 0 var(--nhexa-desktop-glow-tight) var(--nhexa-desktop-glow))
    brightness(1);
}

.app-item:hover::before,
.app-item:focus-visible::before {
  background: var(--app-color);
}

.app-item:hover .app-face::before,
.app-item:focus-visible .app-face::before {
  opacity: 0.12;
}

.app-item:hover .app-face::after,
.app-item:focus-visible .app-face::after {
  opacity: 1;
  animation: appShine 0.5s ease-out forwards;
}

.app-item:hover .app-label,
.app-item:focus-visible .app-label {
  color: var(--app-color);
}

/* The keyboard's ring (never on a mouse click: that's :focus without -visible). */
.app-item:focus-visible::after {
  opacity: 1;
}

/* Pressed: briefly a little smaller, and brighter. */
.app-item:active {
  transform: translateY(-2px) scale(0.96);
  filter:
    drop-shadow(0 0 var(--nhexa-desktop-glow-wide) var(--nhexa-desktop-glow))
    drop-shadow(0 0 var(--nhexa-desktop-glow-tight) var(--nhexa-desktop-glow))
    brightness(1.15);
  transition-duration: var(--nhexa-desktop-press-duration);
}

/* The app open now: a steady, subtle glow, its border in its color. */
.app-item.current {
  filter:
    drop-shadow(0 0 calc(var(--nhexa-desktop-glow-wide) / 2) var(--nhexa-desktop-glow-soft))
    drop-shadow(0 0 0 transparent)
    brightness(1);
}

.app-item.current::before {
  background: var(--app-color);
}

.app-item.current .app-face::before {
  opacity: 0.1;
}

.app-item.current:hover,
.app-item.current:focus-visible {
  filter:
    drop-shadow(0 0 var(--nhexa-desktop-glow-wide) var(--nhexa-desktop-glow-soft))
    drop-shadow(0 0 var(--nhexa-desktop-glow-tight) var(--nhexa-desktop-glow))
    brightness(1);
}

.app-item.current:active {
  filter:
    drop-shadow(0 0 var(--nhexa-desktop-glow-wide) var(--nhexa-desktop-glow))
    drop-shadow(0 0 var(--nhexa-desktop-glow-tight) var(--nhexa-desktop-glow))
    brightness(1.15);
}

/* Without motion: the states change at once, nothing moves or scales. */
@media (prefers-reduced-motion: reduce) {
  .app-item,
  .app-item::before,
  .app-item::after,
  .app-face::before {
    transition: none;
  }

  .app-item:hover,
  .app-item:focus-visible,
  .app-item:active {
    transform: none;
  }

  .app-item:hover .app-face::after,
  .app-item:focus-visible .app-face::after {
    animation: none;
    opacity: 0;
  }
}

@keyframes appShine {
  from { background-position: 200% center; }
  to   { background-position: -100% center; }
}

.app-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: brightness(0) saturate(100%) invert(64%) sepia(11%) saturate(1268%) hue-rotate(166deg) brightness(89%) contrast(83%);
  transition: transform 0.25s ease;
}

.app-item:hover .app-icon {
  transform: scale(1.08);
}

.app-icon-fa {
  font-size: 2rem;
  color: #73a5cc;
  position: relative;
  z-index: 1;
  transition: transform 0.25s ease;
}

.app-item:hover .app-icon-fa {
  transform: scale(1.08);
}

.app-label {
  position: relative;
  z-index: 1;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--nhexa-white);
  text-align: center;
  transition: color 0.18s ease;
}

.app-description {
  position: relative;
  z-index: 1;
  font-size: 9px;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.category-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.28);
  text-transform: uppercase;
}

/* The honeycomb strip: the hexagons interlock, every other one half a hexagon lower. */
.category-apps,
.app-launcher.loading {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0;
  padding: 0 0 calc(150px * 0.866 / 2) calc(150px * 0.25);
}

.category-apps > *,
.app-launcher.loading > * {
  margin-left: calc(var(--hex-w) * -0.25 + var(--hex-gap));
}

.category-apps > :nth-child(even),
.app-launcher.loading > :nth-child(even) {
  margin-top: calc(var(--hex-h) / 2 + var(--hex-gap) / 2);
}

.app-item-skeleton {
  --hex-w: 150px;
  --hex-h: calc(var(--hex-w) * 0.866);
  --hex-gap: 6px;
  width: var(--hex-w);
  height: var(--hex-h);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--components-background);
  -webkit-mask: var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat;
  mask: var(--nhexa-desktop-hex-flat) center / 100% 100% no-repeat;
}

@media (max-width: 600px) {
  .app-item,
  .app-item-skeleton {
    --hex-w: 118px;
  }

  .category-apps,
  .app-launcher.loading {
    padding: 0 0 calc(118px * 0.866 / 2) calc(118px * 0.25);
  }
}

.skeleton-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(90deg, #5b5b5bfd, var(--components-background), #5b5b5bfd);
  background-size: 200% 100%;
  animation: skeletonShine 1.8s infinite;
}

.skeleton-label {
  width: 70%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #5b5b5bfd, var(--components-background), #5b5b5bfd);
  background-size: 200% 100%;
  animation: skeletonShine 1.8s infinite 0.1s;
}

.skeleton-desc {
  width: 50%;
  height: 6px;
  border-radius: 4px;
  background: linear-gradient(90deg, #5b5b5bfd, var(--components-background), #5b5b5bfd);
  background-size: 200% 100%;
  animation: skeletonShine 1.8s infinite 0.2s;
}

@keyframes skeletonShine {
  0%   { background-position: -100%; }
  100% { background-position: 200%; }
}

/* Vue Transition */
.desktop-enter-active,
.desktop-leave-active {
  transition: opacity 0.3s ease;
}

.desktop-enter-from,
.desktop-leave-to {
  opacity: 0;
}

.desktop-enter-active .app-launcher {
  transition: opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s;
}

.desktop-enter-from .app-launcher {
  opacity: 0;
  transform: translateY(24px);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import DesktopDock from './DesktopDock.component.vue';

const emit = defineEmits<{ close: [] }>();

const store = useStore();

const categories = computed(() => store.appList);
const loaded = computed(() => categories.value.length > 0);

function isCurrent(app: any): boolean {
  try {
    return new URL(app.url).host === window.location.host;
  } catch {
    return false;
  }
}

function select(app: any) {
  if (isCurrent(app)) {
    emit('close');
  } else {
    window.location.href = app.url;
  }
}
</script>

<template>
  <Transition name="desktop" appear>
    <div class="app-desktop" @click.self="emit('close')">
      <DesktopDock @close="emit('close')" />
      <div class="app-launcher" :class="{ loading: !loaded }">
        <template v-if="loaded">
          <div v-for="cat in categories" :key="cat.id" class="category">
            <span class="category-label">{{ cat.name.toUpperCase() }}</span>
            <div class="category-apps">
              <button
                v-for="app in cat.apps"
                :key="app.url"
                type="button"
                class="app-item"
                :class="{ current: isCurrent(app) }"
                :style="{ '--app-color': '#73a5cc' }"
                @click="select(app)"
              >
                <span class="app-face">
                  <img v-if="app.icon" :src="app.icon" :alt="app.label" class="app-icon" />
                  <font-awesome-icon v-else :icon="['fas', 'table-cells-large']" class="app-icon-fa" />
                  <span class="app-label">{{ app.label.toUpperCase() }}</span>
                  <span class="app-description">{{ app.description }}</span>
                </span>
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="n in 4" :key="n" class="app-item-skeleton">
            <div class="skeleton-icon" />
            <div class="skeleton-label" />
            <div class="skeleton-desc" />
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>
