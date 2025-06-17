<script lang="ts" setup>
import { FetchError } from "ofetch";

import type { SelectLocationLogImage } from "~/lib/db/schema";

const config = useRuntimeConfig();
const locationStore = useLocationStore();
const route = useRoute();
const { currentLocationLog: log } = storeToRefs(locationStore);
const { $csrfFetch } = useNuxtApp();
const image = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref<string>("");
const imageInput = useTemplateRef("imageInput");
const isOpen = ref(false);
const isDeleting = ref(false);
const deletingImage = ref<SelectLocationLogImage | null>(null);

function onDialogClose() {
  deletingImage.value = null;
  isOpen.value = false;
}

async function confirmDelete() {
  if (!deletingImage.value) {
    return;
  }
  isOpen.value = false;
  try {
    isDeleting.value = true;
    errorMessage.value = "";
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}/image/${deletingImage.value?.id}`, {
      method: "DELETE",
    });
    await locationStore.refreshCurrentLocationLog();
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
  deletingImage.value = null;
}
function deleteImage(image: SelectLocationLogImage) {
  deletingImage.value = image;
  isOpen.value = true;
}

function selectImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}
async function getChecksum(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}
async function uploadImage() {
  if (!image.value || !previewUrl.value)
    return;
  loading.value = true;
  errorMessage.value = "";
  const previewImage = new Image();
  previewImage.addEventListener("load", async () => {
    console.log(previewImage.width, previewImage.height);
    const width = Math.min(1000, previewImage.width);
    const resized = await createImageBitmap(previewImage, {
      resizeWidth: width,
    });
    const canvas = new OffscreenCanvas(width, resized.height);
    canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.9,
    });

    const checksum = await getChecksum(blob);

    try {
      const { fields, key, url } = await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/sign-image`, {
        method: "POST",
        body: {
          checksum,
          contentLength: blob.size,
        },
      });
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", blob);

      await $fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "x-amz-checksum-algorithm": "SHA256",
        },
      });

      await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/image`, {
        method: "POST",
        body: { key },
      });

      await locationStore.refreshCurrentLocationLog();
      image.value = null;
      previewUrl.value = null;
      errorMessage.value = "";
      loading.value = false;
      if (imageInput.value) {
        imageInput.value.value = "";
      }
    }
    catch (error) {
      if (error instanceof FetchError) {
        errorMessage.value = error.statusMessage || "Unknown error";
      }
      else if (error instanceof Error) {
        errorMessage.value = error.message;
      }
      else {
        errorMessage.value = "An unexpected error occurred";
      }
    }

    loading.value = false;
  });
  previewImage.src = previewUrl.value;
}
</script>

<template>
  <div>
    <h2 class="mb-2">
      Manage "{{ log?.name }}"" Images
    </h2>
    <div class="flex gap-2">
      <div class="flex gap-2 flex-col w-72">
        <div class="bg-gray-500 h-28 w-full flex justify-center items-center relative">
          <p v-if="!previewUrl" class="text-white text-center">
            Select an image
          </p>
          <img
            v-else
            :src="previewUrl"
            alt="Image Preview"
            class="h-full object-cover"
          />
          <div v-if="loading || errorMessage" class="size-full absolute flex items-center justify-center bg-black opacity-50">
            <div v-if="loading" class="loading loading-lg"></div>
            <p v-else-if="errorMessage" class="error">
              {{ errorMessage }}
            </p>
          </div>
        </div>
        <input
          ref="imageInput"
          type="file"
          name="image"
          class="file-input"
          :disabled="loading"
          @change="selectImage"
        />
        <button class="btn btn-primary" :disabled="!image || loading" @click="uploadImage">
          Upload
          <Icon name="tabler:photo-share" size="24" />
        </button>
      </div>
      <div v-if="log">
        <AppImageList :images="log.images">
          <template #default="{ image: item }">
            <button :disabled="isDeleting && item.key === deletingImage?.key" class="btn btn-error btn-sm" @click="deleteImage(item)">
              Delete
              <div v-if="isDeleting && item.key === deletingImage?.key" class="loading loading-xs"></div>
              <Icon v-else name="tabler:trash-x-filled" size="16" />
            </button>
          </template>
        </AppImageList>
        <AppDialog
          :is-open="isOpen"
          title="Are you sure?"
          description="Deleting this image cannot  be undone. Do you really want to do this?"
          confirm-class="btn-error"
          confirm-label="Yes, delete this image!"
          @on-closed="onDialogClose"
          @on-confirmed="confirmDelete"
        >
          <img class="max-h-64 my-4 flex w-full flex-1 object-cover" :src="`${config.public.s3BucketUrl}/${deletingImage?.key}`" />
        </AppDialog>
      </div>
    </div>
  </div>
</template>
