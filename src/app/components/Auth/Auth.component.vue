<style scoped lang="scss" src="./Auth.component.scss" />
<script setup lang="ts">

import { useStore } from '../../../middlewares/store/index';
import { useRoute, useRouter } from 'vue-router';

const store: any = useStore();
const route: any = useRoute();
const router: any = useRouter();
const token: any = route.params.token;

onMounted(async () => {
  token && store.handleUserData(token);
  router.push("/");;
})



</script>

<template>
  <div class="loader"></div>
</template>