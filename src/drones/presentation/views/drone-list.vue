<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useDronesStore} from '../../application/drones.store.js';
import DroneImage from '../components/drone-image.vue';
const store = useDronesStore();
const {t, locale} = useI18n();
const search = ref(''),
  status = ref('');
const options = computed(() => [
  {label: t('drones.all'), value: ''},
  ...['AVAILABLE', 'DISCONNECTED', 'ON_MISSION', 'MAINTENANCE'].map((value) => ({
    value,
    label: t(`drones.${value}`),
  })),
]);
const filtered = computed(() =>
  store.drones.filter(
    (item) =>
      `${item.name} ${item.model} ${item.serialNumber}`
        .toLowerCase()
        .includes(search.value.trim().toLowerCase()) &&
      (!status.value || item.status === status.value),
  ),
);
function latest(drone) {
  return store.flights
    .filter((item) => String(item.droneId) === String(drone.id))
    .sort((a, b) => new Date(b.startedAt || b.createdAt) - new Date(a.startedAt || a.createdAt))[0];
}
function plotName(drone) {
  return (
    store.plots.find((item) => String(item.id) === String(latest(drone)?.plotId))?.name ||
    t('drones.none')
  );
}
function lastDate(drone) {
  const value = latest(drone)?.startedAt || latest(drone)?.createdAt;
  return value && !isNaN(Date.parse(value))
    ? new Intl.DateTimeFormat(locale.value, {dateStyle: 'short', timeStyle: 'short'}).format(
        new Date(value),
      )
    : t('drones.none');
}
onMounted(() => store.load());
</script>
<template>
  <section class="plots-page drones-page" :aria-busy="store.loading">
    <h1>{{ t('drones.title') }}</h1>
    <div class="plot-filters">
      <div class="filter-field">
        <label for="drone-search">{{ t('drones.search') }}</label
        ><pv-input-text id="drone-search" v-model="search" type="search" />
      </div>
      <div class="filter-field">
        <label for="drone-status">{{ t('plots.filterStatus') }}</label
        ><pv-select
          input-id="drone-status"
          v-model="status"
          :options="options"
          option-label="label"
          option-value="value"
        />
      </div>
    </div>
    <div class="list-toolbar">
      <p>{{ t('plots.total', {count: filtered.length}) }}</p>
      <router-link class="action-link" to="/drones/new">{{ t('drones.add') }}</router-link>
    </div>
    <p v-if="store.loading" role="status">{{ t('plots.loading') }}</p>
    <div v-else-if="store.error" role="alert" class="error-message">
      <p>{{ t(store.error) }}</p>
      <pv-button :label="t('plots.retry')" @click="store.load()" />
    </div>
    <p v-else-if="!filtered.length" class="empty-state">
      {{ t(store.drones.length ? 'plots.noMatches' : 'drones.empty') }}
    </p>
    <div v-else class="drone-list">
      <article v-for="drone in filtered" :key="drone.id" class="plot-card drone-card">
        <DroneImage :src="drone.imageUrl" :name="drone.name" />
        <div>
          <h2>{{ drone.name }}</h2>
          <div class="drone-facts">
            <p>{{ t('drones.model') }}: {{ drone.model }}</p>
            <p>{{ t('drones.camera') }}: {{ drone.camera }}</p>
            <p>{{ t('drones.plot') }}: {{ plotName(drone) }}</p>
            <p>{{ t('drones.status') }}: {{ t(`drones.${drone.status}`) }}</p>
            <p>{{ t('drones.battery') }}: {{ drone.battery }}%</p>
            <p>{{ t('drones.autonomy') }}: {{ drone.autonomyMinutes }} min</p>
            <p>{{ t('drones.lastFlight') }}: {{ lastDate(drone) }}</p>
          </div>
        </div>
        <router-link
          class="action-link"
          :to="`/drones/${drone.id}`"
          :aria-label="`${t('plots.details')}: ${drone.name}`"
          >{{ t('plots.details') }}</router-link
        >
      </article>
    </div>
  </section>
</template>
