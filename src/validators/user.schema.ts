import { z } from 'zod';
import { RoleName } from '@/generated/prisma/enums';
import { registerBodySchema } from '@/validators/auth.schema';

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive('id is invalid'),
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;

const nameSchema = z
  .string('name is invalid')
  .trim()
  .max(100, 'name must be at most 100 characters');

const rolesSchema = z
  .array(z.enum(RoleName, 'roles is invalid'), 'roles is invalid')
  .refine(
    (roles) => new Set(roles).size === roles.length,
    'roles must not contain duplicates'
  );

export const createUserBodySchema = registerBodySchema.extend({
  name: nameSchema.optional(),
  roles: rolesSchema.min(1, 'roles is required'),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const updateUserBodySchema = z
  .object({
    name: nameSchema,
    roles: rolesSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
