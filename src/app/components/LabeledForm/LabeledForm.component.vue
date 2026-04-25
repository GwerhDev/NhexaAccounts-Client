<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="form-container">
    <div class="title-section">
      <h2>{{ title }}</h2>
      <slot name="actions" />
    </div>
    <div class="body-container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--components-background-alt);
  backdrop-filter: blur(10px);
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 1rem;
  background-color: var(--components-background);
  backdrop-filter: blur(10px);
}

.body-container {
  gap: 1rem;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.ul-form {
  margin: 0;
  padding: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;


  li {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
}

.edit-buttons-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

.cancel-button {
  background: rgb(71, 71, 71);

  &:hover {
    background: rgb(90, 90, 90);
    border-color: transparent;
  }
}
</style>
