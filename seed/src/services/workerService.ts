import workerStore, { WorkerWithDocuments } from '../stores/workerStore';
import redisCache from '../cache/redisCache';

const getWorkerWithDocuments = async (
  workerId: number,
): Promise<WorkerWithDocuments | null> => {
  const cacheKey = `worker:${workerId}`;
  const cachedWorker = await redisCache.get<WorkerWithDocuments>(cacheKey);

  if (cachedWorker) {
    return cachedWorker;
  }

  const worker = await workerStore.getWorkerWithDocuments(workerId);

  await redisCache.set(cacheKey, worker);

  return worker;
};

export default {
  getWorkerWithDocuments,
};
