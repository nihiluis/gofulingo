import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { LanguageCodeSchema, VocabularyResponseSchema } from "./schema"

export const getVocabulariesRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/vocabulary`,
  request: {
    query: z.object({
      languageCode: LanguageCodeSchema,
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: VocabularyResponseSchema,
        },
      },
      description: "Get vocabularies by language code",
    },
  },
})

export type GetVocabulariesRoute = typeof getVocabulariesRoute

export const getVocabulariesHandler =
  (
    vocabularyService: VocabularyService
  ): AppRouteHandler<GetVocabulariesRoute> =>
  async c => {
    const { languageCode } = c.req.valid("query")
    const vocabularies = await vocabularyService.getVocabularies(languageCode)
    return c.json({ vocabularies })
  }
