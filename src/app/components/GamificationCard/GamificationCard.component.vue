<script setup lang="ts">
// TODO: conectar a GET /user/gamification cuando esté disponible
const XP_CAP = 500;
const userXP = 0;
const userLevel = 1;
const userAchievements = 0;
</script>

<template>
  <div class="gamification-card">
    <div class="gamification-header">
      <span>Progreso</span>
      <span class="rank-badge">
        <font-awesome-icon icon="fa-solid fa-bolt" />
        Novicio
      </span>
    </div>
    <div class="level-row">
      <span class="level-label">Nivel {{ userLevel }}</span>
      <span class="xp-label">{{ userXP }} / {{ XP_CAP }} XP</span>
    </div>
    <div class="xp-bar-track">
      <div class="xp-bar-fill" :style="{ width: (userXP / XP_CAP * 100) + '%' }" />
    </div>
    <div class="achievements-row">
      <font-awesome-icon icon="fa-solid fa-trophy" />
      <span>{{ userAchievements }} logros desbloqueados</span>
    </div>
    <p class="coming-soon">El sistema de logros estará disponible próximamente en todas las apps del ecosistema.</p>
  </div>
</template>

<style scoped lang="scss" src="./GamificationCard.component.scss" />
