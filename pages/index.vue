<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="hero bg-base-300 container mx-auto mt-4">
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          Hello there
        </h1>
        <p class="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
          quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <div v-if="!authStore.user" class="flex flex-col w-full">
          <AuthButton />

          <br />
          <button

            :disabled="authStore.loading"
            class="btn btn-accent"
            @click="authStore.guestSignIn"
          >
            Guest Sign Up
            <span v-if="authStore.loading" class="loading loading-spinner loading-md"></span>
            <Icon v-else name="tabler:user-filled" size="24" />
          </button>
        </div>

        <NuxtLink v-else to="/dashboard" class="btn btn-primary">
          Start Logging
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
