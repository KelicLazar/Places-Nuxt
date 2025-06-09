<script lang="ts" setup>
import type { InsertLocationLogType } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
//   currentLocationError: error,
//   currentLocationStatus: status,
} = storeToRefs(locationStore);

async function onSubmit(values: InsertLocationLogType) {
  await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
    method: "put",
    body: values,
  });
}
function submitComplete() {
  navigateTo({
    name: "dashboard-location-slug-id",
    params: {
      slug: route.params.slug,
      id: route.params.id,
    },
  });
}
onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});
</script>

<template>
  <AppLocationLogForm
    v-if="locationLog"
    submit-label="Update location log"
    submit-icon="tabler:map-pin-up"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="locationLog"
  />
</template>
