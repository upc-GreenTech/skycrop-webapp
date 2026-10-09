import {Report} from './report.entity.js';
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
function sum(items, key) {
  return items.every((item) => finite(item[key]))
    ? items.reduce((total, item) => total + item[key], 0)
    : null;
}
function average(items, key) {
  const values = items.filter((item) => finite(item[key]));
  return values.length === items.length && values.length
    ? values.reduce((total, item) => total + item[key], 0) / values.length
    : null;
}
export function createSeasonalReport(reports, attributes) {
  const {title, season, year, startDate, endDate} = attributes;
  const start = Date.parse(`${startDate}T00:00:00Z`),
    end = Date.parse(`${endDate}T23:59:59.999Z`);
  if (
    !title?.trim() ||
    !['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'].includes(season) ||
    !Number.isInteger(Number(year)) ||
    Number(year) < 2000 ||
    Number(year) > 2100 ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start > end
  )
    throw new Error('Invalid period');
  const sources = reports.filter(
    (item) =>
      item.type !== 'SEASONAL' &&
      Date.parse(item.generatedAt) >= start &&
      Date.parse(item.generatedAt) <= end,
  );
  if (sources.length < 5) throw new Error('Insufficient reports');
  const metrics = sources.map((item) => item.metrics);
  const grouped = new Map();
  sources.forEach((report) =>
    report.performance.forEach((row) => {
      const key = row.plotId ?? row.plotName;
      if (key === undefined) return;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(row);
    }),
  );
  const performance = [...grouped.values()].map((rows) => ({
    plotId: rows[0].plotId,
    plotName: rows[0].plotName,
    crops: [
      ...new Set(
        rows.flatMap((row) =>
          Array.isArray(row.crops) ? row.crops : row.crops ? [row.crops] : [],
        ),
      ),
    ],
    alerts: sum(rows, 'alerts'),
    flights: sum(rows, 'flights'),
    averageNdvi: average(rows, 'averageNdvi'),
  }));
  return new Report({
    title: title.trim(),
    season,
    year: Number(year),
    type: 'SEASONAL',
    generatedAt: new Date().toISOString(),
    generatedBy: 'SkyCrop',
    sourceReportIds: sources.map((item) => item.id),
    metrics: {
      flights: sum(metrics, 'flights'),
      alerts: sum(metrics, 'alerts'),
      areaHectares: null,
      averageNdvi: average(metrics, 'averageNdvi'),
    },
    performance,
    ndviEvolution: sources
      .filter((item) => finite(item.metrics.averageNdvi))
      .map((item) => ({date: item.generatedAt, value: item.metrics.averageNdvi}))
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
  });
}
