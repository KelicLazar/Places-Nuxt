<script lang="ts" setup>
import { CENTER_USA as RAW_CENTER_USA } from "~/lib/constants";

const CENTER_USA: [number, number] = [RAW_CENTER_USA[0], RAW_CENTER_USA[1]];
const zoom = 2;
const colorMode = useColorMode();

const style = computed(() => {
  return colorMode.value === "dark" ? "./styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty";
});

const mapStore = useMapStore();
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
      <template #marker>
        <div class="tooltip tolltip-top" :data-tip="point.label">
          <Icon name="tabler:map-pin-filled" size="30" class="text-amber-600" />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
