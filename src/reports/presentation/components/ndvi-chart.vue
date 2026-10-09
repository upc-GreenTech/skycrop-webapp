<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
const props = defineProps({points: {type: Array, default: () => []}});
const {t, locale} = useI18n();
const points = computed(() =>
  props.points
    .filter(
      (point) =>
        Number.isFinite(point.value) &&
        point.value >= -1 &&
        point.value <= 1 &&
        Number.isFinite(Date.parse(point.date)),
    )
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
);
const coordinates = computed(() =>
  points.value.map((point) => {
    const first = Date.parse(points.value[0].date),
      last = Date.parse(points.value.at(-1).date);
    return {
      x: first === last ? 310 : 50 + ((Date.parse(point.date) - first) / (last - first)) * 520,
      y: 220 - (point.value + 1) * 95,
      ...point,
    };
  }),
);
const date = (value) =>
  new Intl.DateTimeFormat(locale.value, {dateStyle: 'short'}).format(new Date(value));
</script>
<template>
  <div>
    <h2>{{ t('reports.evolution') }}</h2>
    <p v-if="!points.length">{{ t('reports.noNdvi') }}</p>
    <template v-else
      ><svg viewBox="0 0 620 265" role="img" :aria-label="t('reports.evolution')">
        <g v-for="value in [-1, 0, 1]" :key="value">
          <line
            x1="50"
            :y1="220 - (value + 1) * 95"
            x2="570"
            :y2="220 - (value + 1) * 95"
            stroke="#ffffff60"
          />
          <text x="12" :y="225 - (value + 1) * 95" fill="white">{{ value }}</text>
        </g>
        <polyline
          :points="coordinates.map((point) => `${point.x},${point.y}`).join(' ')"
          fill="none"
          stroke="white"
          stroke-width="3"
        />
        <circle
          v-for="(point, index) in coordinates"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="5"
          fill="white"
        >
          <title>{{ date(point.date) }}: {{ point.value }}</title>
        </circle>
        <text x="50" y="250" fill="white">{{ date(points[0].date) }}</text>
        <text x="570" y="250" text-anchor="end" fill="white">{{ date(points.at(-1).date) }}</text>
      </svg>
      <details>
        <summary>{{ t('reports.chartData') }}</summary>
        <ul>
          <li v-for="(point, index) in points" :key="index">
            {{ date(point.date) }}: {{ point.value }}
          </li>
        </ul>
      </details></template
    >
  </div>
</template>
