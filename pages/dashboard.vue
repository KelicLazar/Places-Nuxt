<script lang="ts" setup>
import { Icon } from "#components";

const isSidebarOpen = ref(true);
const route = useRoute();
const locationsStore = useLocationStore();
const mapStore = useMapStore();
onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  mapStore.disableFlyTo = localStorage.getItem("fly-to-prefference") === "true";

  if (route.path !== "/dashboard") {
    locationsStore.refresh();
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

const sidebarStore = useSidebarStore();
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all shrink-0 duration-400" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex hover:cursor-pointer  hover:bg-base-200" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32" />
        <Icon v-else name="tabler:chevron-right" size="32" />
      </div>
      <div class="flex flex-col ">
        <SidebarButton
          :show-label="isSidebarOpen"
          href="/dashboard"
          icon="tabler:map"
          label="Locations"
        />
        <SidebarButton
          :show-label="isSidebarOpen"
          href="/dashboard/add/"
          icon="tabler:circle-plus-filled"
          label="Add Location"
        />

        <div v-if="sidebarStore.sidebarItems.length || sidebarStore.loading" class="divider"></div>
        <div v-if="sidebarStore.loading" class="skeleton h-4 w-full"></div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :href="item.href"
            :show-label="isSidebarOpen"
            :icon="item.icon"
            :label="item.label"
            :icon-color="mapStore.selectedPoint === item.location ? 'text-accent' : undefined"
            :class="{
              'border-accent': item.location === mapStore.selectedPoint,
              'border-transparent': item.location !== mapStore.selectedPoint,
            }"
            @mouseenter="mapStore.selectedPoint = item.location || null"
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
      <div class="size-full flex" :class="{ 'flex-col': route.path !== '/dashboard/add/' }">
        <NuxtPage />
        <AppMap class="flex-1 mb-2" />
      </div>
    </div>
  </div>
</template>
