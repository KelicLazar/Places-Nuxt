import type { SelectLocation, SelectLocationLog } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

export function createMapPointFromLocation(location: SelectLocation): MapPoint {
  return {
    ...location,
    to: { name: "dashboard-location-slug", params: { slug: location.slug } },
    toLabel: "View",
  };
}

export function isPointSelected(item: Pick<MapPoint, "id" | "lat" | "long"> | null | undefined, selectedPoint: MapPoint | null | undefined) {
  return item?.id === selectedPoint?.id && item?.lat === selectedPoint?.lat && item?.long === selectedPoint?.long;
}

export function createMapPointFromLocationLog(log: SelectLocationLog): MapPoint {
  return {
    ...log,
    to: { name: "dashboard-location-slug-id", params: { id: log.id } },
    toLabel: "View",
  };
}
