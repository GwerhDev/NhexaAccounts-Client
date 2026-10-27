<style scoped lang="scss" src="./DesktopDock.component.scss" />
<script setup lang="ts">
import { ACCOUNTS_URL, CLIENT_URL } from '../../../middlewares/misc/const';

// The desktop's fixed tools, always there whatever StreamBy's catalog says: Nhexa's home, the
// account, and the settings (not available yet). The one this site already is closes the
// desktop instead of reloading it.
const emit = defineEmits<{ close: [] }>();

const HERE = 'account';

const TOOLS = [
  { id: 'home', label: 'Inicio', icon: 'house', url: CLIENT_URL },
  { id: 'account', label: 'Cuenta', icon: 'user', url: ACCOUNTS_URL },
];

function select(tool: typeof TOOLS[number]) {
  if (tool.id === HERE) emit('close');
  else window.location.href = tool.url;
}
</script>

<template>
  <nav class="desktop-dock" data-testid="desktop-dock">
    <button
      v-for="tool in TOOLS"
      :key="tool.id"
      type="button"
      class="dock-tool"
      :class="{ current: tool.id === HERE }"
      :title="tool.label"
      :aria-label="tool.label"
      :aria-current="tool.id === HERE ? 'page' : undefined"
      :data-testid="`dock-${tool.id}`"
      @click="select(tool)"
    >
      <font-awesome-icon :icon="['fas', tool.icon]" />
    </button>
    <span class="dock-separator" />
    <button
      type="button"
      class="dock-tool"
      title="Configuración (próximamente)"
      aria-label="Configuración (próximamente)"
      data-testid="dock-settings"
      disabled
    >
      <font-awesome-icon :icon="['fas', 'gear']" />
    </button>
  </nav>
</template>
