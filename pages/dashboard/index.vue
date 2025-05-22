<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all  duration-400" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex hover:cursor-pointer  hover:bg-base-200" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32" />
        <Icon v-else name="tabler:chevron-right" size="32" />
      </div>
      <div class="flex flex-col ">
        <SidebarButton :show-label="isSidebarOpen" href="/dashboard" icon="tabler:map" label="Locations" />
        <SidebarButton :show-label="isSidebarOpen" href="/dashboard/add/" icon="tabler:circle-plus-filled" label="Add Location" />

        <div class="divider"></div>
        <SidebarButton :show-label="isSidebarOpen" href="/sign-out" icon="tabler:logout-2" label="Sign Out" />
      </div>
    </div>
    <div class="flex-1 bg-amber-300">
    </div>
  </div>
</template>
