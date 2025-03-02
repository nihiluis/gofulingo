import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { SuggestionsResponseSchema } from "./schema"

export const getSuggestionsRoute = createRoute({
  method: "post",
  path: `${BASE_PATH}/vocabulary/suggestions`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            query: z.string(),
            languageCode: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuggestionsResponseSchema,
        },
      },
      description: "Get vocabulary suggestions",
    },
  },
})

export type GetSuggestionsRoute = typeof getSuggestionsRoute

export const getSuggestionsHandler =
  (
    vocabularyService: VocabularyService
  ): AppRouteHandler<GetSuggestionsRoute> =>
  async c => {
    const { query, languageCode } = c.req.valid("json")
    const result = await vocabularyService.retrieveVocabularySuggestions(
      query,
      languageCode
    )

    return c.json({ suggestions: result.suggestions })
  }
