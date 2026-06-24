<script setup lang="ts">
// TODO: conectar a GET /user/gamification cuando esté disponible
const XP_CAP = 500;
const userXP = 0;
const userLevel = 1;
const userAchievements = 0;
const xpPercent = Math.round((userXP / XP_CAP) * 100);
</script>

<template>
  <div class="gamification-card">
    <div class="gamification-top">
      <div class="level-circle">
        <span class="level-number">{{ userLevel }}</span>
        <span class="level-lbl">Nivel</span>
      </div>
      <div class="gamification-info">
        <div class="rank-row">
          <span class="rank-badge">
            <font-awesome-icon icon="fa-solid fa-bolt" />
            Novicio
          </span>
        </div>
        <div class="xp-section">
          <div class="xp-meta">
            <span class="xp-label">XP</span>
            <span class="xp-value">{{ userXP }} / {{ XP_CAP }}</span>
          </div>
          <div class="xp-bar-track">
            <div class="xp-bar-fill" :style="{ width: xpPercent + '%' }" />
          </div>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <font-awesome-icon icon="fa-solid fa-trophy" class="stat-icon" />
            <span class="stat-value">{{ userAchievements }}</span>
            <span class="stat-label">logros</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <font-awesome-icon icon="fa-solid fa-star" class="stat-icon" />
            <span class="stat-value">0</span>
            <span class="stat-label">racha</span>
          </div>
        </div>
      </div>
    </div>
    <p class="coming-soon">El sistema de logros estará disponible próximamente en todas las apps del ecosistema.</p>
  </div>
</template>

<style scoped lang="scss" src="./GamificationCard.component.scss" />
