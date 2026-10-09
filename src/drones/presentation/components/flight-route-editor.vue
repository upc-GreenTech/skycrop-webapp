<script setup>
import {reactive, ref, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useDronesStore} from '../../application/drones.store.js';
import RouteMap from './route-map.vue';
const {t} = useI18n(),
  store = useDronesStore();
const editingId = ref(undefined),
  notice = ref('');
const form = reactive({
  name: '',
  plotId: '',
  altitudeMeters: 30,
  speedMetersPerSecond: 5,
  waypoints: [],
});
const point = reactive({latitude: '', longitude: ''});
const plots = computed(() => store.plots.map((item) => ({label: item.name, value: item.id})));
const selectedPlot = computed(() =>
  store.plots.find((item) => String(item.id) === String(form.plotId)),
);
const center = computed(() =>
  Number.isFinite(selectedPlot.value?.latitude) && Number.isFinite(selectedPlot.value?.longitude)
    ? [selectedPlot.value.latitude, selectedPlot.value.longitude]
    : [-9.19, -75.02],
);
const validPoint = computed(
  () =>
    point.latitude !== '' &&
    point.longitude !== '' &&
    Number.isFinite(Number(point.latitude)) &&
    Math.abs(Number(point.latitude)) <= 90 &&
    Number.isFinite(Number(point.longitude)) &&
    Math.abs(Number(point.longitude)) <= 180,
);
const valid = computed(
  () =>
    form.name.trim() &&
    form.plotId !== '' &&
    Number(form.altitudeMeters) > 0 &&
    Number(form.speedMetersPerSecond) > 0 &&
    form.waypoints.length >= 2,
);
function addPoint(value) {
  form.waypoints.push(value);
  notice.value = '';
}
function reset() {
  editingId.value = undefined;
  Object.assign(form, {
    name: '',
    plotId: '',
    altitudeMeters: 30,
    speedMetersPerSecond: 5,
    waypoints: [],
  });
}
function edit(route) {
  editingId.value = route.id;
  Object.assign(form, {
    name: route.name,
    plotId: route.plotId,
    altitudeMeters: route.altitudeMeters,
    speedMetersPerSecond: route.speedMetersPerSecond,
    waypoints: (route.waypoints || []).map((item) => ({...item})),
  });
  notice.value = '';
}
async function save() {
  if (!valid.value) return;
  const result = await store.saveRoute(
    {
      ...form,
      altitudeMeters: Number(form.altitudeMeters),
      speedMetersPerSecond: Number(form.speedMetersPerSecond),
    },
    editingId.value,
  );
  if (result) {
    reset();
    notice.value = 'drones.routeSaved';
  }
}
async function plan(id) {
  if (await store.planFlight(id)) notice.value = 'drones.flightPlanned';
}
const canPlan = computed(
  () =>
    store.selectedDrone?.status === 'AVAILABLE' &&
    !store.flights.some(
      (item) =>
        String(item.droneId) === String(store.selectedDrone.id) &&
        ['PLANNED', 'IN_PROGRESS'].includes(item.status),
    ),
);
</script>
<template>
  <div>
    <h2>{{ t('drones.routes') }}</h2>
    <p>{{ t('drones.routeHelp') }}</p>
    <p v-if="notice" class="success-message" role="status">{{ t(notice) }}</p>
    <p v-if="!store.plots.length" class="empty-state">
      {{ t('drones.needPlot') }} <router-link to="/plots/new">{{ t('plots.add') }}</router-link>
    </p>
    <form v-else @submit.prevent="save" class="drone-route-grid">
      <fieldset class="plot-card">
        <legend>{{ t(editingId === undefined ? 'drones.newRoute' : 'drones.editRoute') }}</legend>
        <div class="form-field">
          <label for="route-name">{{ t('drones.routeName') }}</label
          ><pv-input-text
            id="route-name"
            v-model="form.name"
            required
            maxlength="120"
            :disabled="store.saving"
          />
        </div>
        <div class="form-field">
          <label for="route-plot">{{ t('drones.plot') }}</label
          ><pv-select
            input-id="route-plot"
            v-model="form.plotId"
            :options="plots"
            option-label="label"
            option-value="value"
            :disabled="store.saving || editingId !== undefined"
            @change="form.waypoints = []"
          />
        </div>
        <div class="form-field">
          <label for="route-altitude">{{ t('drones.altitude') }} (m)</label
          ><pv-input-text
            id="route-altitude"
            v-model="form.altitudeMeters"
            type="number"
            min="1"
            required
            :disabled="store.saving"
          />
        </div>
        <div class="form-field">
          <label for="route-speed">{{ t('drones.speed') }} (m/s)</label
          ><pv-input-text
            id="route-speed"
            v-model="form.speedMetersPerSecond"
            type="number"
            min="0.1"
            step="0.1"
            required
            :disabled="store.saving"
          />
        </div>
        <div class="form-actions">
          <pv-button
            v-if="editingId !== undefined"
            type="button"
            :label="t('plots.cancel')"
            :disabled="store.saving"
            @click="reset"
          /><pv-button
            type="submit"
            :label="t('drones.saveRoute')"
            :disabled="!valid || store.saving"
            :loading="store.saving"
          />
        </div>
      </fieldset>
      <div class="plot-card">
        <h2>{{ t('drones.waypoints') }}</h2>
        <p>{{ t('drones.mapHelp') }}</p>
        <RouteMap
          :points="form.waypoints"
          :center="center"
          :disabled="store.saving"
          @add="addPoint"
        />
        <div class="coordinate-fields">
          <div class="form-field">
            <label for="route-latitude">{{ t('plots.latitude') }}</label
            ><pv-input-text
              id="route-latitude"
              v-model="point.latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              :disabled="store.saving"
            />
          </div>
          <div class="form-field">
            <label for="route-longitude">{{ t('plots.longitude') }}</label
            ><pv-input-text
              id="route-longitude"
              v-model="point.longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              :disabled="store.saving"
            />
          </div>
        </div>
        <pv-button
          type="button"
          :label="t('drones.addPoint')"
          :disabled="!validPoint || store.saving"
          @click="
            addPoint({latitude: Number(point.latitude), longitude: Number(point.longitude)});
            point.latitude = '';
            point.longitude = '';
          "
        />
        <ol class="waypoint-list">
          <li v-for="(waypoint, index) in form.waypoints" :key="index">
            {{ waypoint.latitude }}, {{ waypoint.longitude }}
            <button
              type="button"
              :aria-label="`${t('drones.removePoint')} ${index + 1}`"
              :disabled="store.saving"
              @click="form.waypoints.splice(index, 1)"
            >
              {{ t('drones.removePoint') }}
            </button>
          </li>
        </ol>
      </div>
    </form>
    <p v-if="!store.routes.length" class="empty-state">{{ t('drones.noRoutes') }}</p>
    <div v-for="route in store.routes" :key="route.id" class="plot-card drone-route-row">
      <div>
        <h3>{{ route.name }}</h3>
        <p>
          {{
            store.plots.find((item) => String(item.id) === String(route.plotId))?.name ||
            t('drones.none')
          }}
          · {{ route.altitudeMeters }} m · {{ route.speedMetersPerSecond }} m/s ·
          {{ (route.waypoints || []).length }} {{ t('drones.waypoints') }}
        </p>
      </div>
      <div class="plot-card-actions">
        <pv-button
          :label="t('drones.editRoute')"
          :disabled="store.saving"
          @click="edit(route)"
        /><pv-button
          :label="t('drones.planFlight')"
          :disabled="!canPlan || store.saving"
          @click="plan(route.id)"
        />
      </div>
    </div>
  </div>
</template>
