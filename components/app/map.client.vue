<script lang="ts" setup>
import { CENTER_USA as RAW_CENTER_USA } from "~/lib/constants";

const CENTER_USA: [number, number] = [RAW_CENTER_USA[0], RAW_CENTER_USA[1]];
const zoom = 2;
const colorMode = useColorMode();

const style = computed(() => {
  return colorMode.value === "dark" ? "./styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty";
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
