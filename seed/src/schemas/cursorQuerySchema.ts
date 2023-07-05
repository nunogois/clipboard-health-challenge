import { z } from 'zod';

export const cursorQuerySchema = z.object({
  cursor: z.number({ coerce: true }).int().positive().optional(),
});

export type CursorQuerySchema = z.infer<typeof cursorQuerySchema>;
