import { findLocation, removeLocationBySlug } from "~/lib/db/queries/location";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") || "";

  const locationToDelete = await findLocation(slug, event.context.user.id);
  if (!locationToDelete)
    return;

  const deleted = await removeLocationBySlug(slug, event.context.user.id,

  );
  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found",
    });
  }
  setResponseStatus(event, 204);
  // return deleted;
});
