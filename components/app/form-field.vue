<script lang="ts" setup>
const props = defineProps<
  { error?: string; label: string; name: string; type?: string; disabled?: boolean }
>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :disabled="disabled"
      :as="type === 'textarea' ? 'textarea' : 'input' "
      :name="name"
      :type="type || 'text'"
      class="textarea w-full min-h-12"
      :class="{ 'input-error': props.error, 'input': !type || type !== 'textarea', 'textarea': type === 'textarea' }"
    />
    <div v-if="props.error" class="label text-error">
      {{ props.error }}
    </div>
  </fieldset>
</template>
