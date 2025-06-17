<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

defineProps<{
  images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="flex mt-2 gap-2">
    <div v-for="image in images" :key="image.id" class="card compact-card h-40 w-64 shring-0 flex bg-base-300 items-center justify-center">
      <div class="card-body size-full flex p-2.5 ">
        <img class="size-full h-24 flex-1 shrink  object-cover" :src="`${config.public.s3BucketUrl}/${image.key}`" />
        <slot :image></slot>
      </div>
    </div>
  </div>
</template>
