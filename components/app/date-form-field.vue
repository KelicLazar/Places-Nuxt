<script lang="ts" setup>
const props = defineProps<
  {
    error?: string;
    label: string;
    name: string;
    value: number;
    type?: string;
    disabled?: boolean;
  }
>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  value: props.value,
});

function formatDate(value: number | string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formatted = `${year}-${month}-${day}`;
  return formatted;
}
function dateChanged(event: Event) {
  const { value } = event.target as HTMLInputElement;
  console.log(value);
  handleChange(new Date(value).getTime());
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :disabled="disabled"
      :as="type === 'textarea' ? 'textarea' : 'input' "
      :name="name"
      type="date"
      class="w-full input min-h-12"
      :class="{ 'input-error': props.error }"
      :value="formatDate(inputValue)"
      @blur="handleBlur"
      @change="dateChanged"
    />
    <div v-if="props.error" class="label text-error">
      {{ props.error }}
    </div>
  </fieldset>
</template>
