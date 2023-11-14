import { prisma } from "../models";
import { ICategoryService } from "../types/category";

class CategoryService implements ICategoryService {
  private categoryModel = prisma.category;

  async getCategories() {
    const category = await this.categoryModel.findMany()

    return category;
  }

  async getCategoryById(category_id: number) {
    const category = await this.categoryModel.findFirst({
      where: {
        category_id: category_id,
      },
    });

    return category;
  }
}

export default CategoryService;