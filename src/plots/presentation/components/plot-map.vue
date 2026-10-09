<script setup>
import {onMounted, onBeforeUnmount, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({latitude: {type: Number, default: null}, longitude: {type: Number, default: null}, editable: Boolean, disabled: Boolean});
const emit = defineEmits(['select']);
const {t} = useI18n();
const container = ref(null);
const tileError = ref(false);
let map;
let marker;
let resizeObserver;

function updateMarker() {
  if (!map) return;
  if (props.latitude === null || props.longitude === null) {
    if (marker) marker.remove();
    marker = null;
    return;
  }
  const point = [props.latitude, props.longitude];
  if (!marker) marker = L.circleMarker(point, {radius: 8, color: '#12658b', fillColor: '#398eaf', fillOpacity: 1}).addTo(map);
  else marker.setLatLng(point);
  map.setView(point, Math.max(map.getZoom(), 13));
}

onMounted(() => {
  map = L.map(container.value, {scrollWheelZoom: false}).setView([-9.19, -75.02], 5);
  const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  tiles.on('tileerror', () => { tileError.value = true; });
  map.on('click', event => {
    if (props.editable && !props.disabled) emit('select', {latitude: Number(event.latlng.lat.toFixed(6)), longitude: Number(event.latlng.lng.toFixed(6))});
  });
  resizeObserver = new ResizeObserver(() => map.invalidateSize());
  resizeObserver.observe(container.value);
  updateMarker();
});
watch(() => [props.latitude, props.longitude], updateMarker);
onBeforeUnmount(() => { resizeObserver?.disconnect(); map?.remove(); });
</script>

<template>
  <div class="plot-map-container">
    <div ref="container" class="plot-location-map" :aria-label="t('plots.map')"></div>
    <p v-if="tileError" class="map-notice" role="status">{{ t('plots.mapUnavailable') }}</p>
  </div>
</template>
