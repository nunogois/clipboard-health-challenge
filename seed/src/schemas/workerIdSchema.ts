import { z } from 'zod';

export const workerIdParamSchema = z.object({
  workerId: z.number({ coerce: true }).int().positive(),
});

export type WorkerIdParamSchema = z.infer<typeof workerIdParamSchema>;
