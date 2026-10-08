import productService from '@/services/product.service';
import { asyncHandler } from '@/utils/async-handler';
import {
  CreateProductBody,
  GetProductsQuery,
  ProductIdParam,
  UpdateProductBody,
} from '@/validators/product.schema';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export default {
  getProducts: asyncHandler(async (_req: Request, res: Response) => {
    const query = res.locals.query as GetProductsQuery;
    const products = await productService.getProducts(query);

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Get product list successfully',
      data: products,
    });
  }),

  getProductById: asyncHandler(async (_req: Request, res: Response) => {
    const { id } = res.locals.params as ProductIdParam;
    const product = await productService.getProductById(id);

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Get product successfully',
      data: product,
    });
  }),

  createProduct: asyncHandler(async (_req: Request, res: Response) => {
    const body = res.locals.body as CreateProductBody;
    const product = await productService.createProduct(body);

    return res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  }),

  updateProduct: asyncHandler(async (_req: Request, res: Response) => {
    const body = res.locals.body as UpdateProductBody;
    const { id } = res.locals.params as ProductIdParam;
    const product = await productService.updateProduct(id, body);

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  }),
};
