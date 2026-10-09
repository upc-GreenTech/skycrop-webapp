<script setup>
import {useI18n} from 'vue-i18n';
const {locale, availableLocales, t} = useI18n();
</script>

<template>
  <pv-select-button v-model="locale" :options="availableLocales" :allow-empty="false" :aria-label="t('language')">
    <template #option="slotProps">
      <span>{{ slotProps.option.toUpperCase() }}</span>
    </template>
  </pv-select-button>
</template>
