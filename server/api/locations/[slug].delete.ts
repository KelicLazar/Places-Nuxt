import { findLocation, removeLocationBySlug } from "~/lib/db/queries/location";
import { removeLogsByLocation } from "~/lib/db/queries/location-log";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") || "";

  const locationToDelete = await findLocation(slug, event.context.user.id);
  if (!locationToDelete)
    return;

  await removeLogsByLocation(locationToDelete.id, event.context.user.id);

  const deleted = await removeLocationBySlug(slug, event.context.user.id,

  );
  if (!deleted) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found",
    }));
  }
  setResponseStatus(event, 204);
  // return deleted;
});
