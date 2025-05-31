<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const mapStore = useMapStore();
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    long: CENTER_USA[0],
    lat: CENTER_USA[1],
  },
});

function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("lat", mapStore.addedPoint.lat);
    setFieldValue("long", mapStore.addedPoint.long);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: CENTER_USA[0],
    lat: CENTER_USA[1],
  };
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
  mapStore.addedPoint = null;
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
    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occurred.";
  }
  loading.value = false;
});
</script>

<template>
  <div class="container max-w-md mx-auto p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country
      </p>
    </div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <Icon size="24" name="tabler:alert-triangle" />
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
      <p>Drag the <Icon name="tabler:map-pin-filled" size="20" class="text-warning" /> marker to your desired location. </p>
      <p>Or double click on the map.</p>
      <p
        class="text-s text-warning

      "
      >
        Current Location: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
      </p>
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
