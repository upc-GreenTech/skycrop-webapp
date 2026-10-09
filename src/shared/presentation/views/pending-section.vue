<script setup>
import {useI18n} from 'vue-i18n';
defineProps({titleKey: {type: String, required: true}});
const {t} = useI18n();
</script>

<template>
  <section class="plots-page">
    <h1>{{ t(titleKey) }}</h1>
    <div class="empty-state">
      <p>{{ t('navigation.sectionPending') }}</p>
      <router-link class="action-link" to="/plots">{{ t('plots.back') }}</router-link>
    </div>
  </section>
</template>
