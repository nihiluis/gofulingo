import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute } from "@hono/zod-openapi"
import { VocabularyService } from "../../lib/vocabulary"
import { SingleVocabularyResponseSchema, VocabularySchema } from "./schema"

export const createVocabularyRoute = createRoute({
  method: "post",
  path: `${BASE_PATH}/vocabulary`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: VocabularySchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: SingleVocabularyResponseSchema,
        },
      },
      description: "Create a new vocabulary",
    },
  },
})

export type CreateVocabularyRoute = typeof createVocabularyRoute

export const createVocabularyHandler =
  (
    vocabularyService: VocabularyService
  ): AppRouteHandler<CreateVocabularyRoute> =>
  async c => {
    const input = c.req.valid("json")
    const vocabulary = await vocabularyService.createVocabulary(input)
    
    return c.json({ vocabulary }, 201)
  } 