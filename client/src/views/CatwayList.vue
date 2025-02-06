<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCatways } from '@/services/api';
import type { Catway } from '@/types/api';

const catways = ref<Catway[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        console.log("Chargement des catways...");
        const response = await getCatways();
        console.log("Réponse reçue:", response);
        catways.value = response.data.data;
    } catch (err) {
        console.error("Erreur lors du chargement des catways:", err);
        error.value = "Erreur lors du chargement des catways";
    } finally {
        loading.value = false;
    }
});
</script> 