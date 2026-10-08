import { prisma } from '@/database/postgres.database';
import { Attribute, Prisma } from '@/generated/prisma/client';

const reset = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE attribute_values, attributes RESTART IDENTITY CASCADE`;
};

const ATTRIBUTES: Record<string, string[]> = {
  Size: ['S', 'M', 'L', 'XL'],
  Color: ['Red', 'Blue', 'Black', 'White'],
  Material: ['Cotton', 'Polyester', 'Linen'],
};

const seedAttribute = async () => {
  const attributes: Prisma.AttributeCreateManyInput[] = Object.keys(
    ATTRIBUTES
  ).map((name) => ({ name }));

  const attrs = await prisma.attribute.createManyAndReturn({
    data: attributes,
  });

  return attrs;
};

const seedAttributeValue = async (attrs: Attribute[]) => {
  const attributeValues: Prisma.AttributeValueCreateManyInput[] = attrs.flatMap(
    (attr) =>
      (ATTRIBUTES[attr.name] ?? []).map((value) => ({
        value,
        attributeId: attr.id,
      }))
  );

  await prisma.attributeValue.createMany({
    data: attributeValues,
  });
};

const main = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed production database');
  }

  await reset();
  const attrs = await seedAttribute();
  await seedAttributeValue(attrs);
};

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
