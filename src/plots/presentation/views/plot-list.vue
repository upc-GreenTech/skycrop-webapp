<script setup>
import {useI18n} from 'vue-i18n';
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from 'pinia';
import PlotImage from '../components/plot-image.vue';
import {usePlotsStore} from '../../application/plots.store.js';

const {t, n} = useI18n();
const store = usePlotsStore();
const {plots, loading, error, summaries, summaryError} = storeToRefs(store);
const search = ref('');
const status = ref('');

const statusOptions = computed(() => [
  {label: t('plots.allStatuses'), value: ''},
  {label: t('plots.active'), value: 'ACTIVE'},
  {label: t('plots.inactive'), value: 'INACTIVE'}
]);

const filteredPlots = computed(() => {
  const query = search.value.trim().toLowerCase();
  return plots.value.filter(plot =>
      `${plot.name} ${plot.location} ${plot.cropType} ${summaries.value[plot.id]?.crops || ''}`
          .toLowerCase().includes(query) &&
      (!status.value || plot.status === status.value)
  );
});

onMounted(() => store.fetchPlots());
</script>

<template>
  <section class="plots-page plot-list-page" :aria-busy="loading">
    <div class="page-heading">
      <h1>{{ t('plots.listTitle') }}</h1>
    </div>

    <div class="plot-filters">
      <div class="filter-field">
        <label for="plot-search">{{ t('plots.search') }}</label>
        <pv-input-text id="plot-search" v-model="search" type="search" />
      </div>

      <div class="filter-field">
        <label for="plot-status">{{ t('plots.filterStatus') }}</label>
        <pv-select
            input-id="plot-status"
            v-model="status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
        />
      </div>
    </div>

    <div class="list-toolbar">
      <p>{{ t('plots.total', {count: filteredPlots.length}) }}</p>
      <router-link class="action-link" to="/plots/new">
        {{ t('plots.add') }}
      </router-link>
    </div>

    <p v-if="loading" role="status">{{ t('plots.loading') }}</p>

    <div v-else-if="error" role="alert" class="error-message">
      <p>{{ t(error) }}</p>
      <pv-button :label="t('plots.retry')" @click="store.fetchPlots()" />
    </div>

    <template v-else>
      <p v-if="summaryError" class="error-message" role="status">
        {{ t(summaryError) }}
      </p>
      <p v-if="!plots.length" class="empty-state">
        {{ t('plots.empty') }}
      </p>

      <p v-else-if="!filteredPlots.length" class="empty-state">
        {{ t('plots.noMatches') }}
      </p>

      <div v-else class="plot-grid">
        <article
            v-for="plot in filteredPlots"
            :key="plot.id"
            class="plot-card registered-plot"
        >
          <PlotImage :src="plot.imageUrl" :name="plot.name" />
          <div class="registered-plot-information">
            <h2>{{ plot.name }}</h2>
            <p>
              {{ t('plots.cropType') }}:
              {{ summaries[plot.id]?.crops || plot.cropType || t('plots.notAvailable') }}
            </p>
            <p>{{ t('plots.location') }}: {{ plot.location }}</p>
            <p>{{ t('plots.surface') }}: {{ n(plot.areaHectares) }} ha</p>
            <p>{{ t('plots.soilType') }}: {{ plot.soilType || t('plots.notAvailable') }}</p>
            <p>
              {{ t('plots.activeAlerts') }}:
              {{ summaries[plot.id]?.activeAlerts ?? t('plots.notAvailable') }}
            </p>
            <p>
              {{ t('plots.status') }}:
              {{ t(plot.status === 'ACTIVE' ? 'plots.active' : 'plots.inactive') }}
            </p>
            <div class="plot-card-actions">
              <router-link
                  :to="`/plots/${plot.id}`"
                  :aria-label="t('plots.detailsLink', {name: plot.name})"
              >
                {{ t('plots.details') }}
              </router-link>
              <router-link
                  :to="`/plots/${plot.id}/crops`"
                  :aria-label="t('crops.viewPlotCrops', {name: plot.name})"
              >
                {{ t('plots.cropsLink') }}
              </router-link>
            </div>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>
