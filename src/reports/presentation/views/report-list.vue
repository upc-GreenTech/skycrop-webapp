<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import {useReportsStore} from '../../application/reports.store.js';
const {t, n} = useI18n(),
  store = useReportsStore(),
  router = useRouter();
const search = ref(''),
  season = ref(''),
  showGenerate = ref(false);
const form = reactive({
  title: '',
  season: 'SPRING',
  year: new Date().getFullYear(),
  startDate: '',
  endDate: '',
});
const seasons = computed(() =>
  ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'].map((value) => ({value, label: t(`reports.${value}`)})),
);
const options = computed(() => [{label: t('reports.all'), value: ''}, ...seasons.value]);
const filtered = computed(() =>
  store.reports.filter(
    (item) =>
      `${item.title} ${item.year} ${item.season ? t(`reports.${item.season}`) : ''}`
        .toLowerCase()
        .includes(search.value.trim().toLowerCase()) &&
      (!season.value || item.season === season.value),
  ),
);
const valid = computed(
  () =>
    form.title.trim() &&
    form.startDate &&
    form.endDate &&
    form.startDate <= form.endDate &&
    Number(form.year) >= 2000 &&
    Number(form.year) <= 2100,
);
const number = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? n(value, {maximumFractionDigits: 3})
    : t('reports.unavailable');
async function generate() {
  if (!valid.value) return;
  const report = await store.generate({...form, year: Number(form.year)});
  if (report) router.push(`/reports/${report.id}`);
}
onMounted(() => store.load());
</script>
<template>
  <section class="plots-page reports-page" :aria-busy="store.loading">
    <h1>{{ t('reports.title') }}</h1>
    <div class="plot-filters">
      <div class="filter-field">
        <label for="report-search">{{ t('reports.search') }}</label
        ><pv-input-text id="report-search" v-model="search" type="search" />
      </div>
      <div class="filter-field">
        <label for="report-season">{{ t('reports.season') }}</label
        ><pv-select
          input-id="report-season"
          v-model="season"
          :options="options"
          option-label="label"
          option-value="value"
        />
      </div>
    </div>
    <div class="list-toolbar">
      <p>{{ t('plots.total', {count: filtered.length}) }}</p>
      <pv-button
        :label="t('reports.generate')"
        :disabled="store.loading || store.saving"
        :aria-expanded="showGenerate"
        @click="showGenerate = !showGenerate"
      />
    </div>
    <form v-if="showGenerate" class="plot-card report-generation" @submit.prevent="generate">
      <h2>{{ t('reports.generate') }}</h2>
      <p>{{ t('reports.generateHelp') }}</p>
      <div class="report-form-grid">
        <div class="form-field">
          <label for="report-title">{{ t('reports.name') }}</label
          ><pv-input-text
            id="report-title"
            v-model="form.title"
            required
            maxlength="160"
            :disabled="store.saving"
          />
        </div>
        <div class="form-field">
          <label for="report-year">{{ t('reports.year') }}</label
          ><pv-input-text
            id="report-year"
            v-model="form.year"
            type="number"
            min="2000"
            max="2100"
            step="1"
            required
            :disabled="store.saving"
          />
        </div>
        <div class="form-field">
          <label for="report-generation-season">{{ t('reports.season') }}</label
          ><pv-select
            input-id="report-generation-season"
            v-model="form.season"
            :options="seasons"
            option-label="label"
            option-value="value"
            :disabled="store.saving"
          />
        </div>
        <div class="form-field">
          <label for="report-start">{{ t('reports.startDate') }}</label
          ><pv-input-text
            id="report-start"
            v-model="form.startDate"
            type="date"
            required
            :max="form.endDate || undefined"
            :disabled="store.saving"
          />
        </div>
        <div class="form-field">
          <label for="report-end">{{ t('reports.endDate') }}</label
          ><pv-input-text
            id="report-end"
            v-model="form.endDate"
            type="date"
            required
            :min="form.startDate || undefined"
            :disabled="store.saving"
          />
        </div>
      </div>
      <div class="form-actions">
        <pv-button
          type="button"
          :label="t('plots.cancel')"
          :disabled="store.saving"
          @click="showGenerate = false"
        /><pv-button
          type="submit"
          :label="t('reports.save')"
          :loading="store.saving"
          :disabled="!valid || store.saving"
        />
      </div>
    </form>
    <p v-if="store.loading" role="status">{{ t('plots.loading') }}</p>
    <div v-if="store.error" role="alert" class="error-message">
      <p>{{ t(store.error) }}</p>
      <pv-button v-if="!showGenerate" :label="t('plots.retry')" @click="store.load()" />
    </div>
    <template v-if="!store.loading && (showGenerate || !store.error)"
      ><p v-if="!filtered.length" class="empty-state">
        {{ t(store.reports.length ? 'plots.noMatches' : 'reports.empty') }}
      </p>
      <div v-else class="report-table-wrap">
        <table class="report-table">
          <caption class="visually-hidden">
            {{
              t('reports.title')
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col">{{ t('reports.season') }}</th>
              <th scope="col">{{ t('reports.flights') }}</th>
              <th scope="col">{{ t('reports.alerts') }}</th>
              <th scope="col">{{ t('reports.averageNdvi') }}</th>
              <th scope="col">{{ t('plots.details') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in filtered" :key="report.id">
              <th scope="row">{{ report.title }}</th>
              <td>{{ number(report.metrics.flights) }}</td>
              <td>{{ number(report.metrics.alerts) }}</td>
              <td>{{ number(report.metrics.averageNdvi) }}</td>
              <td>
                <router-link
                  class="action-link"
                  :to="`/reports/${report.id}`"
                  :aria-label="`${t('plots.details')}: ${report.title}`"
                  >{{ t('plots.details') }}</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div></template
    >
  </section>
</template>
