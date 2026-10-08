import { prisma } from '@/database/postgres.database';
import { Prisma } from '@/generated/prisma/client';

const withAttributes = {
  productAttributeValues: { select: { attribute: true, attributeValue: true } },
} satisfies Prisma.ProductInclude;

const withImages = {
  productImages: { select: { image: true } },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof withAttributes & typeof withImages;
}>;

export type AttributeInput = { attributeId: number; attributeValueId: number };
export type ImageInput = { image: string };

export type CreateProductInput = Omit<
  Prisma.ProductUncheckedCreateInput,
  'productAttributeValues'
> & { attributes: AttributeInput[]; images: ImageInput[] };

export type UpdateProductInput = Omit<
  Prisma.ProductUncheckedUpdateInput,
  'productAttributeValues'
> & { attributes?: AttributeInput[]; images?: ImageInput[] };

export default {
  findMany(
    args: Pick<Prisma.ProductFindManyArgs, 'take' | 'skip' | 'orderBy'>
  ) {
    return prisma.product.findMany({
      ...args,
      include: { ...withAttributes, ...withImages },
    });
  },

  findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: { ...withAttributes, ...withImages },
    });
  },

  create({ attributes, images, ...data }: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
        productAttributeValues: { createMany: { data: attributes } },
        productImages: { createMany: { data: images } },
      },
      include: { ...withAttributes, ...withImages },
    });
  },

  update(id: number, { attributes, images, ...data }: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(attributes && {
          productAttributeValues: {
            createMany: { data: attributes },
          },
        }),
        ...(images && { productImages: { createMany: { data: images } } }),
      },
      include: { ...withAttributes, ...withImages },
    });
  },
};
