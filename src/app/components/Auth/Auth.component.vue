<style scoped lang="scss" src="./Auth.component.scss" />
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../../../middlewares/store/index';

const store: any = useStore();
const route: any = useRoute();
const router: any = useRouter();

onMounted(async () => {
  const token: any = route.query.token;
  const callback: any = route.query.callback;

  if (token) {
    await store.handleUserData(token, callback, router);
  }
});

</script>

<template>
  <div class="loader"></div>
</template>