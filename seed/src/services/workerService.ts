import workerStore, {
  WorkerWithDocumentsAndShifts,
} from '../stores/workerStore';
import redisCache from '../cache/redisCache';

const getWorkerWithDocumentsAndShifts = async (
  workerId: number,
): Promise<WorkerWithDocumentsAndShifts | null> => {
  const cacheKey = `worker:${workerId}`;
  const cachedWorker = await redisCache.get<WorkerWithDocumentsAndShifts>(
    cacheKey,
  );

  if (cachedWorker) {
    return cachedWorker;
  }

  const worker = await workerStore.getWorkerWithDocumentsAndShifts(workerId);

  await redisCache.set(cacheKey, worker);

  return worker;
};

export default {
  getWorkerWithDocumentsAndShifts,
};
