<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPasswordStatus, getUserDetail } from '../../../middlewares/services';

const router = useRouter();

const hasPassword = ref(false);
const hasTwoFactor = ref(false);
const isVerified = ref(false);
const hasPersonalInfo = ref(false);

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

onMounted(async () => {
  const [security, detail] = await Promise.all([
    getPasswordStatus(),
    getUserDetail(),
  ]);
  if (security) {
    hasPassword.value = !!security.passwordSetAt;
    hasTwoFactor.value = !!security.twoFactorEnabled;
  }
  if (detail) {
    isVerified.value = !!detail.userData?.isVerified;
    const { firstName, lastName } = detail.accountDetail ?? {};
    hasPersonalInfo.value = !!(firstName && lastName);
  }
});

const navigate = (step: { done: boolean; to: string }) => {
  if (!step.done) router.push(step.to);
};
</script>

<template>
  <div class="security-score">
    <div class="score-header">
      <span>Seguridad de la cuenta</span>
      <span>{{ score }}%</span>
    </div>
    <div class="score-bar-track">
      <div
        class="score-bar-fill"
        :style="{ width: score + '%', backgroundColor: barColor }"
      />
    </div>
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
            :style="{ color: step.done ? barColor : 'rgba(255,255,255,0.25)' }"
          />
        </span>
        <span>{{ step.label }}</span>
        <font-awesome-icon
          v-if="!step.done"
          icon="fa-solid fa-chevron-right"
          style="margin-left: auto; opacity: 0.3; font-size: 0.7rem;"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss" src="./SecurityScore.component.scss" />
