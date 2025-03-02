import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { VocabularySchema } from "./schema"

export const deleteVocabularyRoute = createRoute({
  method: "delete",
  path: `${BASE_PATH}/vocabulary/{id}`,
  request: {
    params: z.object({
      id: z.string().transform(id => parseInt(id, 10)),
    }),
    body: {
      content: {
        "application/json": {
          schema: VocabularySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {},
      description: "Delete vocabulary by ID",
    },
    404: {
      description: "Vocabulary not found",
    },
  },
})

export type DeleteVocabularyRoute = typeof deleteVocabularyRoute

export const deleteVocabularyHandler =
  (
    vocabularyService: VocabularyService
  ): AppRouteHandler<DeleteVocabularyRoute> =>
  async c => {
    const { id } = c.req.valid("param")

    const existingVocabulary = await vocabularyService.getVocabulary(id)
    if (!existingVocabulary) {
      return c.json({}, 404)
    }

    await vocabularyService.deleteVocabulary(id)
    return c.json({})
  }
