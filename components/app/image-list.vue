<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

defineProps<{
  images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();

const visibleRef = ref(false);
const indexRef = ref(0);

function showImg(imgId: number) {
  indexRef.value = imgId;
  visibleRef.value = true;
}

const onHide = () => (visibleRef.value = false);
</script>

<template>
  <div class="flex mt-2 gap-2">
    <div
      v-for="(image, index) in images"
      :key="image.id"
      class="card compact-card h-40 w-64 shring-0 flex bg-base-300 items-center justify-center"
    >
      <div class="card-body size-full flex p-2.5 ">
        <img class="size-full cursor-pointer h-24 flex-1 shrink  object-cover" :src="`${config.public.s3BucketUrl}/${image.key}`" @click="() => showImg(index)" />
        <slot :image></slot>
      </div>
    </div>
    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="images.map(img => `${config.public.s3BucketUrl}/${img.key}`)"
      :index="indexRef"
      :move-disabled="true"
      @hide="onHide"
    />
  </div>
</template>
