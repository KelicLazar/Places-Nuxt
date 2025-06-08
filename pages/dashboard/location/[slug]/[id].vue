<script lang="ts" setup>
const route = useRoute();

const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogError: error,
  currentLocationLogStatus: status,
} = storeToRefs(locationStore);

const loading = computed(() => status.value === "pending");
const errorMessage = computed(() => error.value?.statusMessage);

onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});
</script>

<template>
  <div>
    <div v-if="loading">
      <div class="loading"></div>
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-xl">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
      <p class="text-sm italic text-grey-500">
        <span v-if="locationLog.startedAt !== locationLog.endeddAt">
          {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endeddAt) }}
        </span>

        <span v-else>
          {{ formatDate(locationLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ locationLog?.name }}
      </h2>
      <p class="text-sm">
        {{ locationLog.description }}
      </p>
    </div>
  </div>
</template>
