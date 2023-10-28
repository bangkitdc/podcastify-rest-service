export type ICategory = {
  category_id: number
  name: string
  created_at: Date
  updated_at: Date
}

export type ICategoryService = {
  getCategoryById: (category_id: number) => Promise<ICategory | null>
}