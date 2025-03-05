import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../../lib/vocabulary"
import type { TranslatorService } from "@/lib/translator"
import type { TranslationDBService } from "@/lib/translationDb"

export const createSingleVocabularyTranslationRoute = createRoute({
  method: "post",
  path: `${BASE_PATH}/vocabulary/translation/{id}`,
  request: {
    params: z.object({
      id: z.string().transform(id => parseInt(id, 10)),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            translationId: z.number(),
            translations: z.array(z.string()),
          }),
        },
      },
      description: "Create translations for a vocabulary",
    },
    400: {
      description: "Vocabulary already has a translation",
    },
    404: {
      description: "Vocabulary not found",
    },
  },
})

export type CreateSingleVocabularyTranslationRoute =
  typeof createSingleVocabularyTranslationRoute

interface Props {
  vocabularyService: VocabularyService
  translatorService: TranslatorService
  translationDbService: TranslationDBService
}

export const createSingleVocabularyTranslationHandler =
  ({
    vocabularyService,
    translatorService,
    translationDbService,
  }: Props): AppRouteHandler<CreateSingleVocabularyTranslationRoute> =>
  async c => {
    const { id } = c.req.valid("param")

    const vocabulary = await vocabularyService.getVocabulary(id)
    if (!vocabulary) {
      return c.json({}, 404)
    }

    if (vocabulary.translationId) {
      return c.json({}, 400)
    }

    const translationTexts = await translatorService.translateVocab(
      vocabulary.title,
      vocabulary.languageCode
    )

    const translation = await translationDbService.createTranslation({
      languageCode: vocabulary.languageCode,
      translations: translationTexts,
      word: vocabulary.title,
    })

    await vocabularyService.updateVocabulary(id, {
      translationId: translation.id,
    })

    return c.json(
      {
        translationId: translation.id,
        translations: translationTexts,
      },
      200
    )
  }
