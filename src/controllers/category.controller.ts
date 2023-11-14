import { HttpStatusCode } from "axios";
import { HttpError, ResponseHelper } from "../helpers";
import { ICategoryController, ICategoryService } from "../types/category";
import { Request, Response } from "express";

class CategoryController implements ICategoryController {
  constructor(private categoryService: ICategoryService) {
    this.getCategories = this.getCategories.bind(this);
    this.getCategoryById = this.getCategoryById.bind(this);
  }

  async getCategories(req: Request, res: Response){
    const categories = await this.categoryService.getCategories();
    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation Success',
      categories
    )
  }
  
  async getCategoryById(req: Request, res: Response) {
    const { category_id } = req.body;

    if (!parseInt(category_id)) {
      throw new HttpError(HttpStatusCode.MethodNotAllowed, "Method not allowed");
    }

    const category = await this.categoryService.getCategoryById(
      category_id
    );

    return ResponseHelper.responseSuccess(
      res,
      HttpStatusCode.Ok,
      'Operation success',
      category
    )
  }
}

export default CategoryController;