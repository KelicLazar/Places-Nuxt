<script lang="ts" setup>
import { NuxtLink } from "#components";

import type { MapPoint } from "~/lib/types";

defineProps<{
  mapPoint: MapPoint;
}>();
const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    :to="mapPoint.to"
    class="card card-compact border-2 bg-base-300 h-40  mb-2  shrink-0 w-72 hover:cursor-pointer"
    :class="{
      'border-accent': isPointSelected(mapPoint, mapStore.selectedPoint),
      'border-transparent': !isPointSelected(mapPoint, mapStore.selectedPoint),
    }"
    @mouseenter="mapStore.selectedPoint = mapPoint"
    @mouseleave="mapStore.selectedPoint = null"
  >
    <div class="card-body">
      <slot name="top"></slot>
      <h3 class="text-xl">
        {{ mapPoint.name }}
      </h3>
      <p class="text-m">
        {{ mapPoint.description }}
      </p>
    </div>
  </NuxtLink>
</template>
