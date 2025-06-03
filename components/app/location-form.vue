<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import type { InsertLocationType } from "~/lib/db/schema";
import type { NominatimResult } from "~/lib/types";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocationType | null;
  onSubmit: (location: InsertLocationType) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;

}>();
const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.description || "",
    long: props.initialValues?.long || CENTER_USA[0],
    lat: props.initialValues?.lat || CENTER_USA[1],
  },
});
const onSubmit = handleSubmit(async (values: InsertLocationType) => {
  try {
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});
function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}
function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: +result.lon,
    lat: +result.lat,
    centerMap: true,
  };
}
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
    long: props.initialValues?.long || CENTER_USA[0],
    lat: props.initialValues?.lat || CENTER_USA[1],
  };
});
</script>

<template>
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
    <p class="text-s text-warning">
      Current Coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
    </p>
    <p>To set the coordinates:</p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        <p>Drag the <Icon name="tabler:map-pin-filled" size="20" class="text-warning" /> marker to your desired location. </p>
      </li>
      <li>
        <p>double click on your desired location.</p>
      </li>
      <li>
        <p>Or search for location bellow.</p>
      </li>
    </ul>

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
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        <Icon v-else :name="props.submitIcon" size="24" />
      </button>
    </div>
  </form>
  <div class="divider"></div>
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
