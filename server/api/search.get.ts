import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(

  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);
    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {

        headers: {
          "User-Agent": "nuxt-travel-log-project | keliclazar@gmail.com",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw createError({
          statusCode: 504,
          statusMessage: "Unabable to reach search API.",
        });
      }

      const results = await response.json() as NominatimResult[];
      return results;
    }
    catch {
      throw createError({
        statusCode: 504,
        statusMessage: "Unabable to reach search API2.",
      });
    }
  }, { maxAge: 60 * 60 * 24, name: "search-nominatim", getKey: async (event) => {
    const query = await getQuery(event);
    return query.q?.toString() || "";
  } }),
);
