import { z } from 'zod';

export const paginationQuerySchema = z.object({
  limit: z
    .union([z.literal('all'), z.coerce.number().int().positive().max(100)])
    .optional()
    .default(10),
  page: z.coerce.number().int().positive().optional().default(1),
  sort: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
