<script setup>
import {ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
const props = defineProps({src: String, name: String});
const {t} = useI18n();
const failed = ref(false);
watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);
</script>
<template>
  <div class="drone-image">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="name"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="failed = true"
    />
    <span v-else><i class="pi pi-send" aria-hidden="true"></i>{{ t('drones.noImage') }}</span>
  </div>
</template>
