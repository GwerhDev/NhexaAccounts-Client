<script setup lang="ts">
defineProps<{
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('cancel')">
      <div class="modal-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <span class="modal-title">{{ title }}</span>
          <button class="modal-close" @click="emit('cancel')" aria-label="Cerrar">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn--cancel" @click="emit('cancel')">
            {{ cancelLabel ?? 'Cancelar' }}
          </button>
          <button
            class="modal-btn modal-btn--confirm"
            :class="{ 'modal-btn--danger': danger }"
            @click="emit('confirm')"
          >
            {{ confirmLabel ?? 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in 0.15s ease;
}

.modal-dialog {
  background: var(--components-background-solid);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  width: 100%;
  max-width: 420px;
  margin-inline: 1rem;
  animation: slide-up 0.18s ease;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  padding: 0.25rem;
  color: rgba(229, 229, 229, 0.5);
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;

  &:hover {
    color: rgba(229, 229, 229, 0.9);
    background: none;
    border-color: transparent;
  }
}

.modal-body {
  padding: 1.25rem;
  font-size: 0.88rem;
  line-height: 1.6;
  opacity: 0.8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-btn {
  padding: 0.45rem 1.1rem;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;

  &--cancel {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(229, 229, 229, 0.75);
    &:hover { background: rgba(255, 255, 255, 0.12); border-color: transparent; }
  }

  &--confirm {
    background: var(--primary-color);
    color: var(--nhexa-white);
    &:hover { background: var(--primary-hover-color); border-color: transparent; }
  }

  &--danger {
    background: var(--danger-color);
    color: var(--nhexa-white);
    &:hover { background: var(--danger-color-accent); filter: brightness(0.85); border-color: transparent; }
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(12px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
</style>
