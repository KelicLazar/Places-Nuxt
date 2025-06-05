<script lang="ts" setup>
import type { FetchError } from "ofetch";

// import { AppDialog } from "#components";

const route = useRoute();

const locationStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationError: error,
  currentLocationStatus: status,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);
const scrollContainer = ref<HTMLElement | null>(null);
useHorizontalWheelScroll(scrollContainer);
onMounted(() => {
  locationStore.refreshCurrentLocation();
});
onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshCurrentLocation();
  }
});

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}`, {
      method: "delete",
    });
    navigateTo({ name: "dashboard" });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading"></div>
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-xl">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
      <h2 class="text-xl">
        {{ location?.name }}
        <div class="dropdown dropdown-start  ">
          <div
            tabindex="0"
            role="button"
            class="btn btn-sm p-0"
          >
            <Icon
              size="20"
              name="tabler:dots-vertical"
            />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="{ name: 'dashboard-location-slug-edit', params: { slug: route.params.slug } }">
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>

      <p class="text-sm">
        {{
          location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="text-sm italic mt-4">
        <p>Add a location log to get started.</p>
        <NuxtLink :to="{ name: 'dashboard-location-slug-add', params: { slug: route.params.slug } }" class="btn btn-primary mt-2">
          <Icon name="tabler:map-pin-plus" size="24" />Add location Log
        </NuxtLink>
      </div>

      <div v-if="location?.locationLogs.length" ref="scrollContainer" class="horizontal-scroll">
        <AppLocationCard
          v-for="log in location.locationLogs"
          :key="log.id"
          :map-point="createMapPointFromLocationLog(log)"
        >
          <template #top>
            <p class="text-sm italic text-grey-500">
              <span v-if="log.startedAt !== log.endeddAt">
                {{ formatDate(log.startedAt) }} / {{ formatDate(log.endeddAt) }}
              </span>

              <span v-else>
                {{ formatDate(log.startedAt) }}
              </span>
            </p>
          </template>
        </AppLocationCard>
      </div>
    </div>

    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      :is-open="isOpen"
      title="Are you sure?"
      description="Deleting this location will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      confirm-class="btn-accent"
      confirm-label="Yes, delete this location!"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
