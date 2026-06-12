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

.app-item {
  position: relative;
  overflow: hidden;
  width: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.1rem 0.5rem;
  background: var(--components-background);
  border: 1.5px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.2s ease;
}

.app-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--app-color);
  opacity: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: opacity 0.18s ease;
}

.app-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
  background-size: 300% 100%;
  background-position: 200% center;
  pointer-events: none;
  opacity: 0;
}

.app-item:hover {
  border-color: var(--app-color);
  transform: translateY(-4px);
}

.app-item:hover::before {
  opacity: 0.12;
}

.app-item:hover::after {
  opacity: 1;
  animation: appShine 0.5s ease-out forwards;
}

.app-item:hover .app-label {
  color: var(--app-color);
}

.app-item.current {
  border-color: var(--app-color);
}

.app-item.current::before {
  opacity: 0.10;
}

@keyframes appShine {
  from { background-position: 200% center; }
  to   { background-position: -100% center; }
}

.app-icon {
  width: 56px;
  height: 56px;
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
  font-size: 2.5rem;
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
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
}

.app-item-skeleton {
  width: 116px;
  height: 130px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1.1rem 0.5rem;
  background: var(--components-background);
  border: 1.5px solid rgba(255, 255, 255, 0.06);
}

.skeleton-icon {
  width: 56px;
  height: 56px;
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

const emit = defineEmits<{ close: [] }>();

const store = useStore();

const apps = computed(() => {
  const user = store.appList.user ?? [];
  const admin = (store.appList as any).admin ?? [];
  return [...user, ...admin];
});

const APP_ICONS: Record<string, [string, string]> = {
  spectra:   ['fas', 'wand-magic-sparkles'],
  spellcast: ['fas', 'feather-pointed'],
  streamby:  ['fas', 'photo-film'],
  nhexa:     ['fas', 'layer-group'],
};

function iconFor(app: any): [string, string] {
  const key = app.label?.toLowerCase() ?? '';
  for (const [name, icon] of Object.entries(APP_ICONS)) {
    if (key.includes(name)) return icon;
  }
  return ['fas', 'grid-2'];
}

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
      <div class="app-launcher">
        <template v-if="apps.length">
          <button
            v-for="app in apps"
            :key="app.url"
            type="button"
            class="app-item"
            :class="{ current: isCurrent(app) }"
            :style="{ '--app-color': '#73a5cc' }"
            @click="select(app)"
          >
            <img v-if="app.icon" :src="app.icon" :alt="app.label" class="app-icon" />
            <font-awesome-icon v-else :icon="iconFor(app)" class="app-icon-fa" />
            <span class="app-label">{{ app.label.toUpperCase() }}</span>
            <span class="app-description">{{ app.description }}</span>
          </button>
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
