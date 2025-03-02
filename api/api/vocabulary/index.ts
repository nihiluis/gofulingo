// Export all vocabulary routes and handlers
export {
  createVocabularyRoute,
  createVocabularyHandler,
  type CreateVocabularyRoute,
} from "./create"

export {
  getVocabularyRoute,
  getVocabularyHandler,
  type GetVocabularyRoute,
} from "./get"

export {
  getVocabulariesRoute,
  getVocabulariesHandler,
  type GetVocabulariesRoute,
} from "./list"

export {
  updateVocabularyRoute,
  updateVocabularyHandler,
  type UpdateVocabularyRoute,
} from "./update"

export {
  getSuggestionsRoute,
  getSuggestionsHandler,
  type GetSuggestionsRoute,
} from "./suggestions"

export {
  deleteVocabularyRoute,
  deleteVocabularyHandler,
  type DeleteVocabularyRoute,
} from "./delete"
