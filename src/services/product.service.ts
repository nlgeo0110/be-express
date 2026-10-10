import { ProductImage } from '@/generated/prisma/client';
import attributeValueRepository from '@/repositories/attribute-value.repository';
import productRepository, {
  AttributeInput,
  ImageInput,
  ProductWithRelations,
} from '@/repositories/product.repository';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { getPagination } from '@/utils/pagination';
import {
  CreateProductBody,
  GetProductsQuery,
  UpdateProductBody,
} from '@/validators/product.schema';

const normalizeProductImages = (productImages: Pick<ProductImage, 'image'>[]) =>
  productImages.map(({ image }) => image);

type ProductAttribute = {
  id: number;
  name: string;
  values: { id: number; name: string }[];
};

const normalizeProductAttributeValues = (
  productAttributeValues: ProductWithRelations['productAttributeValues']
) => {
  const productAttributes: ProductAttribute[] = [];

  productAttributeValues.forEach(({ attribute, attributeValue }) => {
    const valueItem = { id: attributeValue.id, name: attributeValue.value };
    const existing = productAttributes.find((item) => item.id === attribute.id);

    if (existing) {
      existing.values.push(valueItem);
    } else {
      productAttributes.push({
        id: attribute.id,
        name: attribute.name,
        values: [valueItem],
      });
    }
  });

  return productAttributes;
};

const toAttributeInputs = (
  attributes: CreateProductBody['attributes']
): AttributeInput[] =>
  attributes.flatMap(({ attributeId, values }) =>
    values.map((attributeValueId) => ({ attributeId, attributeValueId }))
  );

const toImageInputs = (images: CreateProductBody['images']): ImageInput[] =>
  images.map((image) => ({ image }));

const assertValidAttributes = async (attributes: AttributeInput[]) => {
  const attributeValues = await attributeValueRepository.findByIds(
    attributes.map(({ attributeValueId }) => attributeValueId)
  );
  const attributeIdByValueId = new Map(
    attributeValues.map(({ id, attributeId }) => [id, attributeId])
  );
  const invalid = attributes.filter(
    ({ attributeId, attributeValueId }) =>
      attributeIdByValueId.get(attributeValueId) !== attributeId
  );

  if (invalid.length) {
    throw new BadRequestError(
      `Invalid attribute values: ${invalid
        .map(({ attributeValueId }) => attributeValueId)
        .join(', ')}`
    );
  }
};

const normalizeProduct = (product: ProductWithRelations) => {
  const { productImages, productAttributeValues, ...restProduct } = product;

  return {
    ...restProduct,
    images: normalizeProductImages(productImages),
    attributes: normalizeProductAttributeValues(productAttributeValues),
  };
};

export default {
  async getProducts(query: GetProductsQuery) {
    const products = await productRepository.findMany(
      getPagination(query, { id: 'asc' })
    );

    return products.map((product) => normalizeProduct(product));
  },

  async getProductById(id: number) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return normalizeProduct(product);
  },

  async createProduct({ attributes, images, ...data }: CreateProductBody) {
    const attributeInputs = toAttributeInputs(attributes);
    const imagesInputs = toImageInputs(images);
    await assertValidAttributes(attributeInputs);

    const product = await productRepository.create({
      ...data,
      images: imagesInputs,
      attributes: attributeInputs,
    });
    return normalizeProduct(product);
  },

  async updateProduct(
    id: number,
    { attributes, images, ...data }: UpdateProductBody
  ) {
    const attributeInputs = attributes && toAttributeInputs(attributes);
    if (attributeInputs) {
      await assertValidAttributes(attributeInputs);
    }

    const product = await productRepository.update(id, {
      ...data,
      images,
      attributes: attributeInputs,
    });
    return normalizeProduct(product);
  },
};
