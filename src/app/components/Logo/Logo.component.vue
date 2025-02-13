<style scoped lang="scss" src="./Logo.component.scss" />
<script setup lang="ts">
import { computed, watch, ref, Ref } from 'vue';
import { closeMenu } from '../../../helpers/menu';
import { CLIENT_URL } from '../../../middlewares/misc/const';
import { useStore } from '../../../middlewares/store/index';

const nhexaUrl: Ref = ref('');
const store: any = useStore();
const userToken: any = computed(() => store.userToken);
const currentUser: any = computed(() => store.currentUser);
const logged: any = computed(() => currentUser.value.logged);

defineProps({
  width: String
});

watch (() => {
  nhexaUrl.value = userToken.value ? `${CLIENT_URL}/auth?token=${userToken.value}` : CLIENT_URL;
})

</script>

<template>
  <a class="d-flex align-cent logotype" :href="nhexaUrl">
    <img src="../../../assets/svg/nhexa-logo.svg" @click="closeMenu()" :width="width || '50'" alt="">
    <p class="type">NHEXA</p>
  </a>
</template>