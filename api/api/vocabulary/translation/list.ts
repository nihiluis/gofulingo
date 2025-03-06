import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { LanguageCodeSchema, VocabularyTranslationResponseSchema } from "../schema"
import type { VocabularyTranslationService } from "@/lib/vocabularyTranslation"

export const getVocabularyTranslationsRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/vocabulary/translation`,
  request: {
    query: z.object({
      languageCode: LanguageCodeSchema,
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: VocabularyTranslationResponseSchema,
        },
      },
      description: "Get vocabularies by language code",
    },
  },
})

export type GetVocabularyTranslationsRoute = typeof getVocabularyTranslationsRoute

interface Props {
  vocabularyTranslationService: VocabularyTranslationService
}

export const getVocabularyTranslationsHandler =
  ({
    vocabularyTranslationService,
  }: Props): AppRouteHandler<GetVocabularyTranslationsRoute> =>
  async c => {
    const { languageCode } = c.req.valid("query")
    const vocabularies = await vocabularyTranslationService.getVocabularyTranslations(
      languageCode
    )
    return c.json({ vocabularies })
  }
