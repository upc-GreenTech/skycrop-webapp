export class Report {
  #data;
  constructor(data) {
    if (!data.title?.trim() || !Number.isFinite(Date.parse(data.generatedAt)))
      throw new Error('Invalid report');
    this.#data = {...data};
  }
  get id() {
    return this.#data.id;
  }
  get title() {
    return this.#data.title;
  }
  get generatedAt() {
    return this.#data.generatedAt;
  }
  get season() {
    return this.#data.season || '';
  }
  get year() {
    return this.#data.year ?? new Date(this.generatedAt).getFullYear();
  }
  get owner() {
    return this.#data.owner || '';
  }
  get generatedBy() {
    return this.#data.generatedBy || '';
  }
  get type() {
    return this.#data.type || 'MONITORING';
  }
  get content() {
    return this.#data.content || '';
  }
  get metrics() {
    return {...this.#data.metrics};
  }
  get ndviEvolution() {
    return (this.#data.ndviEvolution || []).map((item) => ({...item}));
  }
  get performance() {
    return (this.#data.performance || []).map((item) => ({...item}));
  }
  get sourceReportIds() {
    return [...(this.#data.sourceReportIds || [])];
  }
}
