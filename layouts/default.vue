<script lang="ts" setup>
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="sdasdasdasda flex min-h-screen flex-col ">
    <AppNavBar />
    <main>
      <slot />
    </main>
  </div>
</template>
