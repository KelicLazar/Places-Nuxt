import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null);
  const shouldFlyTo = ref(true);

  const disableFlyTo = ref(false);
  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");
    let bounds: LngLatBounds | null = null;
    const map = useMap();
    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint)
        return;
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat],
      ));

      map.map?.fitBounds(bounds, {
        padding: 50,
        maxZoom: 5,
      });
    });

    effect(() => {
      if (disableFlyTo.value)
        return;
      if (addedPoint.value)
        return;
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          map.map?.flyTo({
            center: [selectedPoint.value.long, selectedPoint.value.lat],
            // zoom: 6,
            speed: 0.5,
          });
        }
        shouldFlyTo.value = true;
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, {
          padding: 50,
        });
      }
    });

    watch(addedPoint, (newValue, oldValue) => {
      if (disableFlyTo.value && !newValue?.centerMap)
        return;
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          // speed: 0.8,

          padding: 0,
        });
      }
    }, {
      immediate: true,
    });
  }
  function selectPointWithoutFlyTo(point: MapPoint | null) {
    shouldFlyTo.value = false;
    selectedPoint.value = point;
  }
  return {
    mapPoints,
    init,
    selectedPoint,
    selectPointWithoutFlyTo,
    addedPoint,
    disableFlyTo,

  };
});
