import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { SingleVocabularyResponseSchema } from "./schema"

export const getVocabularyRoute = createRoute({
  method: "get",
  path: `${BASE_PATH}/vocabulary/{id}`,
  request: {
    params: z.object({
      id: z.string().transform(id => parseInt(id, 10)),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SingleVocabularyResponseSchema,
        },
      },
      description: "Get vocabulary by ID",
    },
    404: {
      description: "Vocabulary not found",
    },
  },
})

export type GetVocabularyRoute = typeof getVocabularyRoute

export const getVocabularyHandler =
  (vocabularyService: VocabularyService): AppRouteHandler<GetVocabularyRoute> =>
  async c => {
    const { id } = c.req.valid("param")
    const vocabulary = await vocabularyService.getVocabulary(id)

    if (!vocabulary) {
      return c.json({}, 404)
    }

    return c.json({ vocabulary })
  } 