import z from 'zod';

export type ApiStatus = 'SUCCESS' | 'ERROR';

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    status: z.enum(['SUCCESS', 'ERROR']),
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema.nullable(),
  });

export interface ApiResponse<T> {
  status: number;
  data: T | null;
}

export const paginationApiRequest = <T extends z.ZodTypeAny>(orderBy: T) =>
  z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    orderBy: orderBy,
    order: z.enum(['asc', 'desc']),
  });

export type PaginationApiRequest<T> = z.infer<
  ReturnType<typeof paginationApiRequest<z.ZodType<T>>>
>;

export const paginationApiResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    meta: z.object({
      page: z.number(),
      size: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
    }),
    data: dataSchema,
  });

export type PaginationApiResponse<T> = z.infer<
  ReturnType<typeof paginationApiResponse<z.ZodType<T>>>
>;

export const statusUpdate = z.object({
  status: z.boolean(),
});

export type StatusUpdate = z.infer<typeof statusUpdate>;
