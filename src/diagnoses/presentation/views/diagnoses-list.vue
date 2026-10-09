<script setup>

import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import {useDiagnosesStore} from "../../application/diagnoses.store.js";


const {t} = useI18n();

const diagnosesStore = useDiagnosesStore();
const {diagnoses, loading: diagnosesLoading, error: diagnosesError} = storeToRefs(diagnosesStore);



onMounted(()=>{
  diagnosesStore.fetchDiagnoses();
})

console.log(diagnoses)

</script>


<template>
  <div class="p-4">
    <h1>Diagnoses</h1>

    <pv-data-table
        :loading="diagnosesLoading"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :value="diagnoses"
        paginator
        striped-rows
        table-style="min-width: 50rem">
      <pv-column header="ID" field="id" sortable/>
      <pv-column header="Date and time" field="generationDate" sortable/>
      <pv-column header="Location" field="topLocation" sortable/>
      <pv-column header="Diagnostic" field="topAnomaly" sortable/>
      <pv-column header="Status" field="status" sortable/>
      <pv-column header="Actions">
        <template #body="slotProps">
          <pv-button label="Details" rounded text/>
        </template>
      </pv-column>
    </pv-data-table>
    <div v-if="diagnosesError.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ diagnosesError.join(', ') }}
    </div>
  </div>
</template>


<style scoped>

</style>