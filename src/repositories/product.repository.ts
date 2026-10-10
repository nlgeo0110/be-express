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
> & { attributes?: AttributeInput[]; images?: string[] };

// Create images in the body but not in the DB; delete images in the DB but not in the body
async function syncImages(
  tx: Prisma.TransactionClient,
  productId: number,
  images: string[]
): Promise<Prisma.ProductImageUpdateManyWithoutProductNestedInput> {
  const existing = await tx.productImage.findMany({
    where: { productId },
    select: { id: true, image: true },
  });
  const wanted = new Set(images);
  const existingUrls = new Set(existing.map((item) => item.image));

  return {
    deleteMany: {
      id: {
        in: existing
          .filter((item) => !wanted.has(item.image))
          .map((item) => item.id),
      },
    },
    createMany: {
      data: [...wanted]
        .filter((image) => !existingUrls.has(image))
        .map((image) => ({ image })),
      skipDuplicates: true,
    },
  };
}

// Match by attributeValueId, consistent with @@unique([productId, attributeValueId])
async function syncAttributes(
  tx: Prisma.TransactionClient,
  productId: number,
  attributes: AttributeInput[]
): Promise<Prisma.ProductAttributeValueUpdateManyWithoutProductNestedInput> {
  const existing = await tx.productAttributeValue.findMany({
    where: { productId },
    select: { id: true, attributeValueId: true },
  });
  const wanted = new Map(
    attributes.map((item) => [item.attributeValueId, item])
  );
  const existingValueIds = new Set(
    existing.map((item) => item.attributeValueId)
  );

  return {
    deleteMany: {
      id: {
        in: existing
          .filter((item) => !wanted.has(item.attributeValueId))
          .map((item) => item.id),
      },
    },
    createMany: {
      data: [...wanted.values()].filter(
        (item) => !existingValueIds.has(item.attributeValueId)
      ),
      skipDuplicates: true,
    },
  };
}

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
        productAttributeValues: {
          createMany: { data: attributes, skipDuplicates: true },
        },
        productImages: { createMany: { data: images, skipDuplicates: true } },
      },
      include: { ...withAttributes, ...withImages },
    });
  },

  update(id: number, { attributes, images, ...data }: UpdateProductInput) {
    return prisma.$transaction(async (tx) => {
      const productImages = images && (await syncImages(tx, id, images));
      const productAttributeValues =
        attributes && (await syncAttributes(tx, id, attributes));

      return tx.product.update({
        where: { id },
        data: {
          ...data,
          ...(productImages && { productImages }),
          ...(productAttributeValues && { productAttributeValues }),
        },
        include: { ...withAttributes, ...withImages },
      });
    });
  },
};
