import productService from '@/services/product.service';
import {
  CreateProductBody,
  GetProductsQuery,
  ProductIdParam,
  UpdateProductBody,
} from '@/validators/product.schema';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';

export default {
  async getProducts(_req: Request, res: Response) {
    const query = res.locals.query as GetProductsQuery;
    const products = await productService.getProducts(query);

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Get product list successfully',
      data: products,
    });
  },

  async getProductById(_req: Request, res: Response) {
    const { id } = res.locals.params as ProductIdParam;
    const product = await productService.getProductById(id);

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Get product successfully',
      data: product,
    });
  },

  async createProduct(req: Request, res: Response) {
    const body = req.body as CreateProductBody;
    const product = await productService.createProduct(body);

    return res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  },

  async updateProduct(req: Request, res: Response) {
    const body = req.body as UpdateProductBody;
    const { id } = res.locals.params as ProductIdParam;
    const product = await productService.updateProduct(id, body);

    return res.status(httpStatus.OK).send({
      code: httpStatus.OK,
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  },
} satisfies Record<string, RequestHandler>;
