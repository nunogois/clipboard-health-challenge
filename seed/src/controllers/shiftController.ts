import { NextFunction, Request, Response } from 'express';
import { Shift } from '@prisma/client';
import shiftService from '../services/shiftService';
import { WorkerIdParamSchema } from '../schemas/workerIdSchema';
import { CursorQuerySchema } from '../schemas/cursorQuerySchema';

const getAllAvailableShifts = async (
  req: Request<WorkerIdParamSchema, {}, {}, CursorQuerySchema>,
  res: Response<Shift[]>,
  next: NextFunction,
) => {
  try {
    const { workerId } = req.params;
    const { cursor } = req.query;

    const eligibleShifts = await shiftService.getAllAvailableShifts(
      workerId,
      cursor,
    );

    return res.json(eligibleShifts);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAvailableShifts,
};
