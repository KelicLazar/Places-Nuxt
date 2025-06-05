<script lang="ts" setup>
import type { InsertLocationType } from "~/lib/db/schema";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocationType;
  onSubmit: (location: InsertLocationType) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;

}>();
</script>

<template>
  <AppLocationBaseForm
    v-slot="{ errors, loading }"
    :schema="InsertLocation"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      long: CENTER_USA[0],
      lat: CENTER_USA[1],
    }
    "
    :zoom="props.zoom || 6"
    :on-submit="props.onSubmit"
    :on-submit-complete="props.onSubmitComplete"
    :submit-icon
    :submit-label
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
  </AppLocationBaseForm>
</template>
