<script lang="ts" setup>
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { CENTER_USA as RAW_CENTER_USA } from "~/lib/constants";

const CENTER_USA: [number, number] = [RAW_CENTER_USA[0], RAW_CENTER_USA[1]];
const zoom = 2;
const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty";
});

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.long = location.lng;
  }
}
function onDoubleClick(event: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.long = event.event.lngLat.lng;
    mapStore.addedPoint.lat = event.event.lngLat.lat;
  }
}

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
    @map:dblclick="onDoubleClick"
  >
    <MglNavigationControl />
    <MglMarker
      v-if="mapStore.addedPoint"
      draggable
      class-name="z-2"
      :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
      @update:coordinates="updateAddedPoint"
    >
      <template #marker>
        <div
          class="tooltip tooltip-open tolltip-top hover:cursor-pointer"
          data-tip="Drag to your desired location"
        >
          <Icon name="tabler:map-pin-filled" size="35" class="text-warning" />
        </div>
      </template>
    </MglMarker>
    <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
      <template #marker>
        <div
          class="tooltip tolltip-top hover:cursor-pointer"
          :data-tip="point.name"
          :class="{
            'tooltip-open': mapStore.selectedPoint === point,
          }"
          @mouseenter="mapStore.selectPointWithoutFlyTo(point)"
          @mouseleave="mapStore.selectPointWithoutFlyTo(null)"
        >
          <Icon name="tabler:map-pin-filled" size="30" :class="mapStore.selectedPoint === point ? 'text-accent z-10 ' : 'text-secondary'" />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
