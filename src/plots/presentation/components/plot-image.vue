<script setup>
import {ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
const props = defineProps({src: {type: String, default: ''}, name: {type: String, required: true}});
const {t} = useI18n();
const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });
</script>

<template>
  <div class="plot-image">
    <img v-if="/^https?:\/\//i.test(src) && !failed" :src="src" :alt="name" loading="lazy" referrerpolicy="no-referrer" @error="failed = true" />
    <div v-else class="plot-image-empty"><i class="pi pi-image" aria-hidden="true"></i><span>{{ t('plots.noImage') }}</span></div>
  </div>
</template>
