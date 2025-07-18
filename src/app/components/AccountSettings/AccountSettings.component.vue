<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { useStore } from '../../../middlewares/store/index';
import ActionTable from '../Tables/ActionTable.component.vue';

// ✅ Props
const props = defineProps<{
  fields: {
    key: string;
    title: string;
    label: string;
    type?: string;
    value: string;
  }[];
}>();

const store = useStore();
const isReady = ref(false);
const id = computed(() => store.currentUser?.userData?.id);

const localFields = ref([...props.fields]);

watch(
  () => store.currentUser,
  (value) => {
    if (value?.userData) {
      localFields.value.forEach((field) => {
        field.value = value.userData[field.key] || '';
      });
      isReady.value = true;
    }
  },
  { immediate: true }
);

const getAction = (fieldKey: string) => {
  return async () => {
    try {
      const field = localFields.value.find((f) => f.key === fieldKey);
      if (!field) return;
      await store.handleUpdateUserData({ [field.key]: field.value }, id.value);
    } catch (error) {
      console.error(error);
    }
  };
};
</script>

<template>
  <section class="section-container">
    <div class="inner-container">
      <ul class="card-container" v-if="isReady">
        <li v-for="field in localFields" :key="field.key">
          <ActionTable
            :title="field.title"
            :field="field"
            :action="getAction(field.key)"
          />
        </li>
      </ul>
      <p v-else class="loading-message">Cargando datos del usuario...</p>
    </div>
  </section>
  <router-view />
</template>

<style scoped lang="scss" src="./AccountSettings.component.scss"></style>
