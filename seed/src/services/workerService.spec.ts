import workerService from '../services/workerService';
import workerStore, { WorkerWithDocuments } from '../stores/workerStore';
import redisCache from '../cache/redisCache';

jest.mock('../stores/workerStore');
jest.mock('../cache/redisCache');

const worker: WorkerWithDocuments = {
  id: 1,
  name: 'Ada Lovelace',
  is_active: true,
  profession: 'CNA',
  documents: [],
};

const mockedWorkerStore = workerStore as jest.Mocked<typeof workerStore>;
const mockedRedisCache = redisCache as jest.Mocked<typeof redisCache>;

describe('workerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWorker', () => {
    it('should return worker from cache if available', async () => {
      mockedRedisCache.get.mockResolvedValueOnce(worker);

      const result = await workerService.getWorkerWithDocuments(worker.id);

      expect(result).toEqual(worker);
      expect(redisCache.get).toHaveBeenCalledWith(`worker:${worker.id}`);
      expect(workerStore.getWorkerWithDocuments).not.toHaveBeenCalled();
      expect(redisCache.set).not.toHaveBeenCalled();
    });

    it('should fetch worker from store and cache it if not available in cache', async () => {
      mockedRedisCache.get.mockResolvedValueOnce(null);
      mockedWorkerStore.getWorkerWithDocuments.mockResolvedValueOnce(worker);

      const result = await workerService.getWorkerWithDocuments(worker.id);

      expect(result).toEqual(worker);
      expect(redisCache.get).toHaveBeenCalledWith(`worker:${worker.id}`);
      expect(workerStore.getWorkerWithDocuments).toHaveBeenCalledWith(
        worker.id,
      );
      expect(redisCache.set).toHaveBeenCalledWith(
        `worker:${worker.id}`,
        worker,
      );
    });
  });
});
