import { findLocation } from "~/lib/db/queries/location";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  // await new Promise(resolve => setTimeout(resolve, 2000));

  const slug = getRouterParam(event, "slug") || "";

  const location = await findLocation(slug, event.context.user.id);

  if (!location) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found",
    });
  }
  return location;
});
