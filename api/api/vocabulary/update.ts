import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { SingleVocabularyResponseSchema, VocabularySchema } from "./schema"

export const updateVocabularyRoute = createRoute({
  method: "put",
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
      content: {
        "application/json": {
          schema: SingleVocabularyResponseSchema,
        },
      },
      description: "Update vocabulary by ID",
    },
    404: {
      description: "Vocabulary not found",
    },
  },
})

export type UpdateVocabularyRoute = typeof updateVocabularyRoute

export const updateVocabularyHandler =
  (
    vocabularyService: VocabularyService
  ): AppRouteHandler<UpdateVocabularyRoute> =>
  async c => {
    const { id } = c.req.valid("param")
    const data = c.req.valid("json")

    const existingVocabulary = await vocabularyService.getVocabulary(id)
    if (!existingVocabulary) {
      return c.json({}, 404)
    }

    await vocabularyService.updateVocabulary(id, data)
    return c.json({ vocabulary: { ...data, id } })
  }
