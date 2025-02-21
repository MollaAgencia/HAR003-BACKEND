export interface PaginatedResult<T> {
  results: T
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}
