<script lang="ts" setup>
const locationsStore = useLocationStore();
const mapStore = useMapStore();
const { locations, locationsStatus: status } = storeToRefs(locationsStore);
const scrollContainer = ref<HTMLElement | null>(null);
useHorizontalWheelScroll(scrollContainer);
onMounted(() => {
  locationsStore.refreshLocations();
});
</script>

<template>
  <div class="p-4 min-h-64">
    <h2 class="text-2xl">
      Locations
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
    <div
      v-else-if="locations && locations.length"
      ref="scrollContainer"
      class="horizontal-scroll flex flex-nowrap mt-4 gap-2 overflow-auto"
    >
      <NuxtLink
        v-for="location in locations"
        :key="location.id"
        :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
        class="card card-compact border-2 bg-base-300 h-40  mb-2  shrink-0 w-72 hover:cursor-pointer"
        :class="{
          'border-accent': isPointSelected(location, mapStore.selectedPoint),
          'border-transparent': !isPointSelected(location, mapStore.selectedPoint),
        }"
        @mouseenter="mapStore.selectedPoint = createMapPointFromLocation(location)"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h3 class="text-xl">
            {{ location.name }}
          </h3>
          <p class="text-m">
            {{ location.description }}
          </p>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary  w-40">
        Add Location <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
