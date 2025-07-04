<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();

const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogError: error,
  currentLocationLogStatus: status,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
      method: "delete",
    });
    navigateTo({ name: "dashboard-location-slug", params: {
      slug: route.params.slug,
    } });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

const loading = computed(() => isDeleting.value || status.value === "pending");
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage);

onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});
onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationStore.refreshCurrentLocationLog();
  }
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
              <NuxtLink :to="{ name: 'dashboard-location-slug-id-edit', params: { slug: route.params.slug, id: route.params.id } }">
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ locationLog.description }}
      </p>
      <div v-if="!locationLog?.images.length && !loading" class="text-sm italic mt-4">
        <NuxtLink :to="{ name: 'dashboard-location-slug-id-images', params: { slug: route.params.slug, id: route.params.id } }" class="btn btn-primary mt-2">
          Add Image  <Icon name="tabler:photo-cog" size="24" />
        </NuxtLink>
      </div>
      <AppImageList :images="locationLog.images" />
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
      :is-open="isOpen"
      title="Are you sure?"
      description="Deleting this location log cannot be undone. Do you really want to do this?"
      confirm-class="btn-error"
      confirm-label="Yes, delete this location log!"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
