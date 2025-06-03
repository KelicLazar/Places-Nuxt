<script lang="ts" setup>
import { Icon } from "#components";

import { CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from "~/lib/constants";

const isSidebarOpen = ref(true);
const route = useRoute();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

const sidebarStore = useSidebarStore();

const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore);

if (LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshCurrentLocation();
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  mapStore.disableFlyTo = localStorage.getItem("fly-to-prefference") === "true";
});
effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Locations",
      href: "/dashboard",
      icon: "tabler:map",
    }, {
      id: "link-location-add",
      label: "Add Location",
      href: "/dashboard/add",
      icon: "tabler:circle-plus-filled",
    }];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to locations",
        href: "/dashboard",
        icon: "tabler:arrow-left",
      },
    ];

    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.sidebarTopItems.push(
        {
          id: "link-dashboard",
          label: currentLocation.value.name,
          to: { name: "dashboard-location-slug", params: {
            slug: route.params.slug,
          } },
          icon: "tabler:map",
        },
        {
          id: "link-location-edit",
          label: "Edit Location",
          to: { name: "dashboard-location-slug-edit", params: {
            slug: route.params.slug,
          } },
          icon: "tabler:map-pin-cog",
        },
        {
          id: "link-location-add",
          label: "Add Location Log",
          to: { name: "dashboard-location-slug-add", params: {
            slug: route.params.slug,
          } },
          icon: "tabler:circle-plus-filled",
        },
      )
      ;
    }
  }
});
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
function toggleFlyTo() {
  mapStore.disableFlyTo = !mapStore.disableFlyTo;
  localStorage.setItem("fly-to-prefference", `${mapStore.disableFlyTo}`);
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all shrink-0 duration-400" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex hover:cursor-pointer  hover:bg-base-200" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32" />
        <Icon v-else name="tabler:chevron-right" size="32" />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :href="item.href"
          :icon="item.icon"
          :label="item.label"
          :to="item.to"
        />
        <div v-if="route.path.startsWith('/dashboard/location') && currentLocationStatus === 'pending'" class="flex items-center justify-center">
          <div class="loading"></div>
        </div>
        <div v-if="sidebarStore.sidebarItems.length || sidebarStore.loading" class="divider"></div>
        <div v-if="sidebarStore.loading" class="skeleton h-4 w-full"></div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :to="item.to"
            :show-label="isSidebarOpen"
            :icon="item.icon"
            :label="item.label"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            :class="{
              'border-accent': isPointSelected(item.mapPoint, mapStore.selectedPoint),
              'border-transparent': isPointSelected(item.mapPoint, mapStore.selectedPoint),
            }"
            @mouseenter="mapStore.selectedPoint = item.mapPoint || null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>
        <div class="divider"></div>

        <label v-if="route.path === '/dashboard'" class=" mx-4 select-none ">

          <input v-model="mapStore.disableFlyTo" type="checkbox" @click="toggleFlyTo" /> Map jumping is annoying<br />
          <small>

            <em>{{ mapStore.disableFlyTo ? "ps: I agree with you." : "" }}</em>
          </small>
        </label>

        <div class="divider"></div>
        <SidebarButton
          :show-label="isSidebarOpen"
          href="/sign-out"
          icon="tabler:logout-2"
          label="Sign Out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto pb-4 pr-4">
      <div
        class="size-full flex"
        :class="{ 'flex-col': !EDIT_PAGES.has(route.name?.toString() || '') }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap />
      </div>
    </div>
  </div>
</template>
