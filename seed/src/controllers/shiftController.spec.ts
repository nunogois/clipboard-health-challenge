import { Shift, Worker } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import shiftService from '../services/shiftService';
import shiftController from '../controllers/shiftController';
import { WorkerIdParamSchema } from '../schemas/workerIdSchema';
import { CursorQuerySchema } from '../schemas/cursorQuerySchema';

jest.mock('../services/shiftService');

const worker: Worker = {
  id: 1,
  name: 'Ada Lovelace',
  is_active: true,
  profession: 'CNA',
};

const shifts: Shift[] = [
  {
    id: 1,
    start: new Date('2021-01-01T00:00:00.000Z'),
    end: new Date('2021-01-01T08:00:00.000Z'),
    profession: 'CNA',
    is_deleted: false,
    facility_id: 1,
    worker_id: null,
  },
  {
    id: 2,
    start: new Date('2021-01-01T08:00:00.000Z'),
    end: new Date('2021-01-01T16:00:00.000Z'),
    profession: 'CNA',
    is_deleted: false,
    facility_id: 2,
    worker_id: null,
  },
];

const mockedShiftService = shiftService as jest.Mocked<typeof shiftService>;

describe('shiftController', () => {
  describe('getAllAvailableShifts', () => {
    it('should return the eligible shifts and send JSON response', async () => {
      const cursor = 123;

      const req = {
        params: { workerId: worker.id },
        query: { cursor: 123 },
      } as Request<WorkerIdParamSchema, {}, {}, CursorQuerySchema>;
      const res = {
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      mockedShiftService.getAllAvailableShifts.mockResolvedValueOnce(shifts);

      await shiftController.getAllAvailableShifts(req, res, next);

      expect(mockedShiftService.getAllAvailableShifts).toHaveBeenCalledWith(
        worker.id,
        cursor,
      );
      expect(res.json).toHaveBeenCalledWith(shifts);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
