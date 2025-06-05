import { findLocation } from "~/lib/db/queries/location";
import { insertLocationLog } from "~/lib/db/queries/location-log";
import { InsertLocationLog } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found",
    }));
  }

  const result = await readValidatedBody(event, InsertLocationLog.safeParse);
  if (!result.success) {
    return sendZodError(event, result.error as any);
  }

  return insertLocationLog(location.id, result.data, event.context.user.id);
});
