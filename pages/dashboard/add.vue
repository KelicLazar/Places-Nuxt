<script lang="ts" setup>
import type { InsertLocationType } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
async function onSubmit(values: InsertLocationType) {
  await $csrfFetch("/api/locations", {
    method: "post",
    body: values,
  });
};

function onSubmitComplete() {
  navigateTo({ name: "dashboard" });
}
</script>

<template>
  <div class="container max-w-md mx-auto p-4 flex flex-col">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country
      </p>
    </div>

    <AppLocationForm
      :on-submit
      :on-submit-complete
      submit-icon="tabler:circle-plus-filled"
      submit-label="Add"
    />
  </div>
</template>
