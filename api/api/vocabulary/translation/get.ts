import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import type { VocabularyTranslationService } from "@/lib/vocabularyTranslation"
import { SingleTranslationResponseSchema } from "../schema"

export const getVocabularyTranslationRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/vocabulary/{id}/translation`,
  request: {
    params: z.object({
      id: z.string().transform(id => parseInt(id, 10)),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SingleTranslationResponseSchema,
        },
      },
      description: "Get translation by vocabulary ID",
    },
    404: {
      description: "Translation not found",
    },
  },
})

export type GetVocabularyTranslationRoute = typeof getVocabularyTranslationRoute

interface Props {
  vocabularyTranslationService: VocabularyTranslationService
}

export const getVocabularyTranslationHandler =
  ({
    vocabularyTranslationService,
  }: Props): AppRouteHandler<GetVocabularyTranslationRoute> =>
  async c => {
    const { id: vocabularyId } = c.req.valid("param")
    const result = await vocabularyTranslationService.getVocabularyTranslation(
      vocabularyId
    )

    if (!result) {
      return c.json({}, 404)
    }

    return c.json({ ...result })
  }
