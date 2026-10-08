import { PaginationQuery } from '@/validators/pagination.schema';

export const getPagination = <T extends string>(
  { limit, page, sort }: PaginationQuery,
  defaultOrderBy: Record<T, 'asc' | 'desc'>
) => {
  const isDesc = sort?.startsWith('-') ?? false;
  const field = sort ? (isDesc ? sort.slice(1) : sort) : undefined;

  return {
    take: limit === 'all' ? undefined : limit,
    skip: limit === 'all' ? 0 : (page - 1) * limit,
    orderBy: field ? { [field]: isDesc ? 'desc' : 'asc' } : defaultOrderBy,
  };
};
