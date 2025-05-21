<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div class="card bg-base-400 container mt-4 min-h-72 text-center mx-auto flex flex-col justify-center items-center gap-4">
    <span class="loading loading-spinner loading-md" />
  </div>
</template>
