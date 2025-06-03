<script lang="ts" setup>
const locationStore = useLocationStore();
const { currentLocation: location, currentLocationError: error, currentLocationStatus: status } = storeToRefs(locationStore);

onMounted(() => {
  locationStore.refreshCurrentLocation();
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading"></div>
    </div>
    <div v-else-if="location">
      <h2 class="text-xl">
        {{ location?.name }}
      </h2>
      <p class="text-sm">
        {{
          location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="text-sm italic mt-4">
        <p>Add a location log to get started.</p>
      </div>
      <button class="btn btn-primary mt-2">
        <Icon name="tabler:map-pin-plus" size="24" />Add location Log
      </button>
    </div>
    <div v-else-if="error">
      <h2 class="text-xl  alert alert-error">
        {{ error.statusMessage }}
      </h2>
    </div>
  </div>
</template>
