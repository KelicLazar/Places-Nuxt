<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { InsertLocation } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation as any),
});
onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost");
    if (!confirm) {
      return false;
    }
    return true;
  }
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  submitError.value = "";
  try {
    const inserted = await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    console.log(inserted);
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.statusMessage || "An unknown error occurred.";
  }
  loading.value = false;
});
</script>

<template>
  <div class="container max-w-md-mx-auto p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add LOcation
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country
      </p>
    </div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <Icon size="24" name="tabler:error" />
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <AppFormField
        name="name"
        label="Name"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormField
        name="description"
        label="Description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <AppFormField
        type="number"
        name="lat"
        label="Latitude"
        :error="errors.lat"
        :disabled="loading"
      />
      <AppFormField
        type="number"
        name="long"
        label="Longitude"
        :error="errors.long"
        :disabled="loading"
      />

      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back"
        >
          <Icon name="tabler:arrow-left" size="24" />Cancel
        </button>
        <button :disabled="loading" type="submit" class="btn btn-primary">
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <Icon v-else name="tabler:circle-plus-filled" size="24" />
        </button>
      </div>
    </form>
  </div>
</template>
