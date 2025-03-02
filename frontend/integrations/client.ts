import createClient from "openapi-fetch"
import type { paths as backendPaths } from "./backend"
import { BACKEND_API_URL } from "~/lib/constants"

export const backendClient = createClient<backendPaths>({
  baseUrl: BACKEND_API_URL,
})
