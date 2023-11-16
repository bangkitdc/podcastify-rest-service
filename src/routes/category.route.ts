import { CategoryService } from '../services';
import CategoryController from '../controllers/category.controller';
import { Router } from 'express';
import { RequestHelper } from '../helpers';
import { AuthMiddleware } from '../middlewares';

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

const categoryRoute = Router();

categoryRoute
  .get(
    '/category',
    AuthMiddleware.authenticateToken,
    RequestHelper.exceptionGuard(categoryController.getCategories),
  )

export default categoryRoute;