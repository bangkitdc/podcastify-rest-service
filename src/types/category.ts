import { IRequestResponseHandler } from "./http"

export type ICategory = {
  category_id: number
  name: string
  created_at: Date
  updated_at: Date
}

export type ICategoryController = {
  getCategories: IRequestResponseHandler
  getCategoryById: IRequestResponseHandler
}

export type ICategoryService = {
  getCategories: () => Promise<ICategory[]>
  getCategoryById: (category_id: number) => Promise<ICategory | null>
}