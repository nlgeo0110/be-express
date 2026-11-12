import express from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '@/middlewares/validate.middleware';
import {
  createProductBodySchema,
  getProductsQuerySchema,
  productIdParamSchema,
  updateProductBodySchema,
} from '@/validators/product.schema';
import productController from '@/controllers/product.controller';

const router = express.Router();

router.get(
  '/',
  validateQuery(getProductsQuerySchema),
  productController.getProducts
);

router.get(
  '/:id',
  validateParams(productIdParamSchema),
  productController.getProductById
);

router.post(
  '/',
  validateBody(createProductBodySchema),
  productController.createProduct
);

router.put(
  '/:id',
  validateParams(productIdParamSchema),
  validateBody(updateProductBodySchema),
  productController.updateProduct
);

export default router;
