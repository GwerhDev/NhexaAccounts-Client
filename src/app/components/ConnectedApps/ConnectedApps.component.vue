<style scoped lang="scss" src="./ConnectedApps.component.scss" />
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../../middlewares/store';
import { getUserToken } from '../../../helpers';

const store = useStore();
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);
const appList: Ref<any[]> = computed(() => store.appList);

console.log(appList.value);

</script>

<template>
  <section class="section-container">
    <div class="inner-container">
      <h2>Visita nuestras aplicaciones</h2>
      <ul class="card-container">
        <li v-if="appList.length" class="app-card-li" v-for="item in appList">
          <a class="app-card" :href="currentUser ? item.url + '/auth?token=' + getUserToken() : item.url"
            target="_blank">
            <h2>{{ item.label }}</h2>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>