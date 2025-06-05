<script lang="ts" setup>
import type { InsertLocationType } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const locationStore = useLocationStore();
const route = useRoute();
async function onSubmit(values: InsertLocationType) {
  console.log("updated!", values);

  await $csrfFetch(`/api/locations/${route.params.slug}`, {
    method: "put",
    body: values,
  });
};
function onSubmitComplete() {
  navigateTo({ name: "dashboard-location-slug", params: {
    slug: route.params.slug,
  } });
}
</script>

<template>
  <AppLocationForm
    v-if="locationStore.currentLocationStatus !== 'pending' && locationStore.currentLocation"
    :on-submit
    :on-submit-complete
    :initial-values="locationStore.currentLocation "
    submit-label="Update"
    submit-icon="tabler:map-pin-up"
    :zoom="11"
  />
</template>
