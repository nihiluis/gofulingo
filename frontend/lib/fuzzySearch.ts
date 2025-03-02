import Fuse from "fuse.js"

export function fuzzySearch<T>(
  items: T[],
  key: keyof T extends string ? keyof T : never,
  query: string
): T[] {
  const fuse = new Fuse(items, {
    includeScore: true,
    threshold: 0.2,
    keys: [key],
  })

  return fuse.search(query).map(result => result.item)
}
