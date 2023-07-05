import { Facility } from '@prisma/client';
import { WorkerWithDocuments } from '../stores/workerStore';
import redisCache from '../cache/redisCache';
import facilityStore from '../stores/facilityStore';

const getFacilitiesOfWorker = async (
  worker: WorkerWithDocuments,
): Promise<Facility[] | null> => {
  const cacheKey = `facilities:worker:${worker.id}`;
  const cachedFacilities = await redisCache.get<Facility[]>(cacheKey);

  if (cachedFacilities) {
    return cachedFacilities;
  }

  const facilities = await facilityStore.getFacilitiesOfWorker(worker);

  await redisCache.set(cacheKey, facilities);

  return facilities;
};

export default {
  getFacilitiesOfWorker,
};
