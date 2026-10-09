import {defineStore} from "pinia";
import {DiagnosesApi} from "../infrastructure/diagnoses-api.js";
import {ref, shallowRef} from "vue";
import {DiagnosisAssembler} from "../infrastructure/diagnosis.assembler.js";
import {Diagnosis} from "../domain/model/diagnosis.entity.js";


export const useDiagnosesStore = defineStore('diagnoses', () => {
    const api = new DiagnosesApi();
    const diagnoses = shallowRef([]);
    const loading = ref(false);
    const saving = ref(false);
    const error = ref('');

    async function fetchDiagnoses(){
        loading.value = true;
        error.value = '';

        try {
            diagnoses.value = DiagnosisAssembler.toEntitiesFromResponse(await api.getAll());
        } catch {
            error.value = 'Unable to load diagnoses.';
        } finally {
            loading.value = false;
        }
    }

    async function registerDiagnosis(attributes) {
        if (saving.value) return null;

        saving.value = true;
        error.value = '';

        try {
            const diagnosis = new Diagnosis(attributes);
            const response = await api.create(DiagnosisAssembler.toResourceFromEntity(diagnosis));
            const savedDiagnosis = DiagnosisAssembler.toEntityFromResource(response.data);

            diagnoses.value = [...diagnoses.value, savedDiagnosis];
            return savedDiagnosis;
        } catch {
            error.value = 'Unable to register diagnosis.';
            return null;
        } finally {
            saving.value = false;
        }
    }

    return {diagnoses, loading, saving, error, fetchDiagnoses, registerDiagnosis}
})