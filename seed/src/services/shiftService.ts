import { Shift } from '@prisma/client';
import workerStore from '../stores/workerStore';
import shiftStore from '../stores/shiftStore';
import redisCache from '../cache/redisCache';
import { NotFoundError } from '../errors/notFoundError';
import facilityService from './facilityService';

const getAllAvailableShifts = async (
  workerId: number,
  cursor?: number,
): Promise<Shift[]> => {
  const worker = await workerStore.getWorkerWithDocuments(workerId);

  if (!worker || !worker.is_active) {
    throw new NotFoundError(`Worker with id ${workerId} not found`);
  }

  const cacheKey = `shifts:${workerId}:${cursor || '0'}`;
  const cachedShifts = await redisCache.get<Shift[]>(cacheKey);

  if (cachedShifts) {
    return cachedShifts;
  }

  const workerFacilities = await facilityService.getFacilitiesOfWorker(worker);

  if (!workerFacilities) {
    throw new NotFoundError(
      `Available facilities for worker with id ${workerId} not found`,
    );
  }

  const eligibleShifts = await shiftStore.getEligibleShifts(
    worker,
    workerFacilities,
    cursor,
  );

  await redisCache.set(cacheKey, eligibleShifts);

  return eligibleShifts;
};

export default {
  getAllAvailableShifts,
};
