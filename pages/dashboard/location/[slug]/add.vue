<script lang="ts" setup>
import type { InsertLocationLogType } from "~/lib/db/schema";

import { CENTER_USA } from "~/lib/constants";

const { $csrfFetch } = useNuxtApp();
const route = useRoute();
const locationStore = useLocationStore();

async function onSubmit(values: InsertLocationLogType) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: "post",
    body: values,
  });
}

async function submitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <div>
    <h2>Add location log</h2>
    <AppLocationLogForm
      submit-label="Add location log"
      submit-icon="tabler:map-pin-plus"
      :on-submit="onSubmit"
      :on-submit-complete="submitComplete"
      :initial-values="{
        name: '',
        description: '',
        startedAt: Date.now() - (24 * 60 * 60 * 1000),
        endeddAt: Date.now(),
        long: locationStore.currentLocation?.long || CENTER_USA[0],
        lat: locationStore.currentLocation?.lat || CENTER_USA[1],

      }"
    />
  </div>
</template>
