import { Router } from 'express';
import shiftsController from '../controllers/shiftController';
import { workerIdParamSchema } from '../schemas/workerIdSchema';
import { validateParamsSchema } from '../middlewares/paramsSchemaMiddleware';
import { cursorQuerySchema } from '../schemas/cursorQuerySchema';
import { validateQuerySchema } from '../middlewares/querySchemaMiddleware';

const router = Router();

router.get(
  '/available/:workerId',
  validateParamsSchema(workerIdParamSchema),
  validateQuerySchema(cursorQuerySchema),
  shiftsController.getAllAvailableShifts,
);

export default router;
