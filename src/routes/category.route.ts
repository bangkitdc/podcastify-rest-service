import { CategoryService } from '../services';
import CategoryController from '../controllers/category.controller';
import { Router } from 'express';
import { RequestHelper } from '../helpers';

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

const categoryRoute = Router();

categoryRoute
  .get(
    '/category',
    RequestHelper.exceptionGuard(categoryController.getCategories),
  )

export default categoryRoute;