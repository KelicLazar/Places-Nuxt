<script lang="ts" setup>
import { Icon } from "#components";

const isSidebarOpen = ref(true);
const route = useRoute();
const locationsStore = useLocationStore();
onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";

  if (route.path !== "/dashboard") {
    locationsStore.refresh();
  }
});
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

const sidebarStore = useSidebarStore();
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all  duration-400" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
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
          />
        </div>
        <div class="divider"></div>
        <SidebarButton
          :show-label="isSidebarOpen"
          href="/sign-out"
          icon="tabler:logout-2"
          label="Sign Out"
        />
      </div>
    </div>
    <div class="flex-1 flex flex-col pb-4 pr-4">
      <NuxtPage />
      <AppMap class="flex-1 mb-2" />
    </div>
  </div>
</template>
