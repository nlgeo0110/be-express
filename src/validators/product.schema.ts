import { z } from 'zod';
import { paginationQuerySchema } from '@/validators/pagination.schema';

export const getProductsQuerySchema = paginationQuerySchema;

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive('id is invalid'),
});

export type ProductIdParam = z.infer<typeof productIdParamSchema>;

const productAttributeSchema = z.object({
  attributeId: z.number().int().positive('attributeId is invalid'),
  values: z
    .array(z.number().int().positive('values is invalid'))
    .min(1, 'values is required')
    .refine(
      (values) => new Set(values).size === values.length,
      'values must not contain duplicates'
    ),
});

export const createProductBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name is required')
    .max(200, 'name must be at most 200 characters'),
  price: z.int('price is invalid').positive('price is invalid'),
  salePrice: z.int('salePrice is invalid').positive('salePrice is invalid'),
  status: z.boolean('status is invalid'),
  description: z.string().trim().min(1, 'description is required'),
  shortDescription: z.string().trim().min(1, 'shortDescription is required'),
  thumbnail: z.url('thumbnail is invalid').trim(),
  images: z.array(z.string('images is invalid')).min(1, 'images is required'),
  attributes: z
    .array(productAttributeSchema)
    .min(1, 'attributes is required')
    .refine(
      (attributes) =>
        new Set(attributes.map(({ attributeId }) => attributeId)).size ===
        attributes.length,
      'attributeId must not be duplicated'
    ),
});

export type CreateProductBody = z.infer<typeof createProductBodySchema>;

export const updateProductBodySchema = createProductBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });

export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
