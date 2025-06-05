<script lang="ts" setup>
import type { InsertLocationLogType } from "~/lib/db/schema";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocationLog } from "~/lib/db/schema";

const props = defineProps<{
  initialValues: InsertLocationLogType;
  onSubmit: (location: InsertLocationLogType) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;

}>();

const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - (24 * 60 * 60 * 1000),
  endeddAt: Date.now(),
  long: CENTER_USA[0],
  lat: CENTER_USA[1],

};
</script>

<template>
  <AppLocationBaseForm
    v-slot="{ errors, loading }"
    :schema="InsertLocationLog"
    :initial-values="props.initialValues || initialValues"
    :on-submit="props.onSubmit"
    :on-submit-complete="props.onSubmitComplete"
    :submit-icon
    :submit-label
    :zoom="11"
  >
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
    <AppDateFormField
      name="startedAt"
      label="Started at"
      type="textarea"
      :error="errors.startedAt"
      :disabled="loading"
      :value="initialValues.startedAt"
    />
    <AppDateFormField
      name="endeddAt"
      label="Ended at"
      :value="initialValues.endeddAt"
      :error="errors.endeddAt"
      :disabled="loading"
    />
  </AppLocationBaseForm>
</template>
