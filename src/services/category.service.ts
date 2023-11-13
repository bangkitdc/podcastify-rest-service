import { prisma } from "../models";
import { ICategoryService } from "../types/category";

class CategoryService implements ICategoryService {
  private categoryModel = prisma.category;

  async getCategoryById(category_id: number) {
    const user = await this.categoryModel.findFirst({
      where: {
        category_id: category_id,
      },
    });

    return user;
  }
}

export default CategoryService;