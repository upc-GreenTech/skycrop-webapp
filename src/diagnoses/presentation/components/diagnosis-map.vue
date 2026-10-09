<script setup>
import {computed, onMounted, onBeforeUnmount, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const props = defineProps({anomalies: {type: Array, default: () => []}});
const {t} = useI18n(),
  container = ref(null),
  tileError = ref(false);
const colors = {LOW: '#2e7d32', MEDIUM: '#ac7200', HIGH: '#d84315', CRITICAL: '#b71c1c'};
const points = computed(() =>
  props.anomalies.filter(
    (item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude),
  ),
);
let map, observer;
onMounted(() => {
  if (!points.value.length) return;
  map = L.map(container.value, {scrollWheelZoom: false}).setView(
    [points.value[0].latitude, points.value[0].longitude],
    14,
  );
  L.tileLayer(
    import.meta.env.VITE_MAP_TILE_URL,
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  )
    .on('tileerror', () => {
      tileError.value = true;
    })
    .addTo(map);
  const markers = points.value.map((item) => {
    const label = document.createElement('span');
    label.textContent = `${t(`diagnoses.${item.type}`)} · ${t(`diagnoses.${item.severity}`)}`;
    return L.circleMarker([item.latitude, item.longitude], {
      radius: 10,
      color: colors[item.severity],
      fillOpacity: 0.8,
    })
      .bindTooltip(label)
      .addTo(map);
  });
  if (markers.length > 1)
    map.fitBounds(L.featureGroup(markers).getBounds(), {padding: [24, 24], maxZoom: 15});
  observer = new ResizeObserver(() => map.invalidateSize());
  observer.observe(container.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  map?.remove();
});
</script>
<template>
  <div>
    <h2>{{ t('diagnoses.map') }}</h2>
    <p v-if="!points.length">{{ t('diagnoses.noCoordinates') }}</p>
    <template v-else
      ><div ref="container" class="plot-location-map" :aria-label="t('diagnoses.map')"></div>
      <p v-if="tileError" class="map-notice" role="status">{{ t('plots.mapUnavailable') }}</p>
      <ul class="diagnosis-legend">
        <li v-for="(color, severity) in colors" :key="severity">
          <span :style="{background: color}" aria-hidden="true"></span
          >{{ t(`diagnoses.${severity}`) }}
        </li>
      </ul></template
    >
  </div>
</template>
