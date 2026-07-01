<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../../../middlewares/store';

const router = useRouter();
const store = useStore();

const hasPassword = computed(() => !!store.passwordStatus?.passwordSetAt);
const hasTwoFactor = computed(() => !!store.passwordStatus?.twoFactorEnabled);
const isVerified = computed(() => !!store.userDetail?.userData?.isVerified);
const hasPersonalInfo = computed(() => {
  const { firstName, lastName } = store.userDetail?.accountDetail ?? {};
  return !!(firstName && lastName);
});

const steps = computed(() => [
  {
    label: 'Correo verificado',
    done: isVerified.value,
    icon: 'fa-solid fa-at',
    to: '/personal-info',
  },
  {
    label: 'Contraseña configurada',
    done: hasPassword.value,
    icon: 'fa-solid fa-key',
    to: '/security',
  },
  {
    label: 'Verificación en dos pasos',
    done: hasTwoFactor.value,
    icon: 'fa-solid fa-shield-halved',
    to: '/security',
  },
  {
    label: 'Información personal completa',
    done: hasPersonalInfo.value,
    icon: 'fa-solid fa-id-card',
    to: '/personal-info',
  },
]);

const score = computed(() => {
  const done = steps.value.filter(s => s.done).length;
  return Math.round((done / steps.value.length) * 100);
});

const barColor = computed(() => {
  if (score.value <= 25) return 'var(--danger-color-accent)';
  if (score.value <= 75) return '#e89c2f';
  return 'var(--primary-color)';
});

// SVG donut — r=36, circumference = 2π*36 ≈ 226.2
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const dashOffset = computed(() => CIRCUMFERENCE * (1 - score.value / 100));

onMounted(async () => {
  await Promise.all([
    store.handleGetPasswordStatus(),
    store.handleGetUserDetail(),
  ]);
});

const navigate = (step: { done: boolean; to: string }) => {
  if (!step.done) router.push(step.to);
};
</script>

<template>
  <div class="security-score">
    <div class="score-layout">
      <!-- Donut -->
      <div class="donut-wrap">
        <svg class="donut-svg" viewBox="0 0 88 88" width="88" height="88">
          <circle
            class="donut-track"
            cx="44" cy="44" :r="RADIUS"
            fill="none" stroke-width="7"
          />
          <circle
            class="donut-fill"
            cx="44" cy="44" :r="RADIUS"
            fill="none" stroke-width="7"
            stroke-linecap="round"
            :stroke="barColor"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 44 44)"
          />
        </svg>
        <div class="donut-label">
          <span class="donut-pct">{{ score }}%</span>
          <span class="donut-sub">seguridad</span>
        </div>
      </div>

      <!-- Steps -->
      <ul class="score-steps">
        <li
          v-for="step in steps"
          :key="step.label"
          class="score-step"
          :class="step.done ? 'done' : 'pending'"
          @click="navigate(step)"
        >
          <span class="step-icon">
            <font-awesome-icon
              :icon="step.done ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle'"
              :style="{ color: step.done ? barColor : 'rgba(255,255,255,0.2)' }"
            />
          </span>
          <span class="step-label">{{ step.label }}</span>
          <font-awesome-icon
            v-if="!step.done"
            icon="fa-solid fa-chevron-right"
            class="step-arrow"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./SecurityScore.component.scss" />
