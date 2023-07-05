import { Router } from 'express';
import shiftRoutes from './routes/shiftRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const router = Router();

router.use('/shifts', shiftRoutes);
router.use(errorMiddleware);

export default router;
