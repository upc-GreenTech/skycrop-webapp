<script setup>
import {onMounted, onBeforeUnmount, watch, ref} from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useI18n} from 'vue-i18n';
const props = defineProps({
  points: {type: Array, default: () => []},
  center: {type: Array, default: () => [-9.19, -75.02]},
  disabled: Boolean,
});
const emit = defineEmits(['add']);
const {t} = useI18n(),
  container = ref(null),
  failed = ref(false);
let map, layer, observer;
function draw() {
  if (!map) return;
  layer.clearLayers();
  const points = props.points.map((point) => [point.latitude, point.longitude]);
  points.forEach((point, index) =>
    L.circleMarker(point, {radius: 7, color: '#12658b'})
      .bindTooltip(String(index + 1))
      .addTo(layer),
  );
  if (points.length > 1) L.polyline(points, {color: '#12658b'}).addTo(layer);
}
onMounted(() => {
  map = L.map(container.value, {scrollWheelZoom: false}).setView(
    props.center,
    props.center[0] === -9.19 ? 5 : 14,
  );
  L.tileLayer(
    import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  )
    .on('tileerror', () => {
      failed.value = true;
    })
    .addTo(map);
  layer = L.layerGroup().addTo(map);
  map.on('click', (event) => {
    if (!props.disabled)
      emit('add', {
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
  });
  observer = new ResizeObserver(() => map.invalidateSize());
  observer.observe(container.value);
  draw();
});
watch(() => props.points, draw, {deep: true});
watch(
  () => props.center,
  (center) => map?.setView(center, 14),
);
onBeforeUnmount(() => {
  observer?.disconnect();
  map?.remove();
});
</script>
<template>
  <div>
    <div ref="container" class="plot-location-map" :aria-label="t('drones.routeMap')"></div>
    <p v-if="failed" class="map-notice" role="status">{{ t('plots.mapUnavailable') }}</p>
  </div>
</template>
