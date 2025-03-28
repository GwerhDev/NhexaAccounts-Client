<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import { computed, Ref } from 'vue';
import { useStore } from '../../../middlewares/store';

const store = useStore();
const appList: Ref<any[]> = computed(() => store.appList);

</script>

<template>
  <section class="section-container">
    <div class="inner-container">
      <h2>Visita nuestras aplicaciones</h2>
      <ul class="card-container">
        <li v-if="appList.length" class="app-card-li" v-for="item in appList">
          <a class="app-card" :href="item.url" target="_blank">
            <h2>{{ item.label }}</h2>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>