import { WorkerWithDocuments } from '../stores/workerStore';
import redisCache from '../cache/redisCache';
import { Facility } from '@prisma/client';
import facilityService from './facilityService';
import facilityStore from '../stores/facilityStore';

jest.mock('../stores/facilityStore');
jest.mock('../cache/redisCache');

const worker: WorkerWithDocuments = {
  id: 1,
  name: 'Ada Lovelace',
  is_active: true,
  profession: 'CNA',
  documents: [],
};

const facilities: Facility[] = [
  {
    id: 1,
    name: 'Facility 1',
    is_active: true,
  },
  {
    id: 2,
    name: 'Facility 2',
    is_active: true,
  },
];

const mockedFacilityStore = facilityStore as jest.Mocked<typeof facilityStore>;
const mockedRedisCache = redisCache as jest.Mocked<typeof redisCache>;

describe('facilityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFacilitiesOfWorker', () => {
    it('should return facilities of worker from cache if available', async () => {
      mockedRedisCache.get.mockResolvedValueOnce(facilities);

      const result = await facilityService.getFacilitiesOfWorker(worker);

      expect(result).toEqual(facilities);
      expect(redisCache.get).toHaveBeenCalledWith(
        `facilities:worker:${worker.id}`,
      );
      expect(facilityStore.getFacilitiesOfWorker).not.toHaveBeenCalled();
      expect(redisCache.set).not.toHaveBeenCalled();
    });

    it('should fetch facilities of worker from store and cache it if not available in cache', async () => {
      mockedRedisCache.get.mockResolvedValueOnce(null);
      mockedFacilityStore.getFacilitiesOfWorker.mockResolvedValueOnce(
        facilities,
      );

      const result = await facilityService.getFacilitiesOfWorker(worker);

      expect(result).toEqual(facilities);
      expect(redisCache.get).toHaveBeenCalledWith(
        `facilities:worker:${worker.id}`,
      );
      expect(facilityStore.getFacilitiesOfWorker).toHaveBeenCalledWith(worker);
      expect(redisCache.set).toHaveBeenCalledWith(
        `facilities:worker:${worker.id}`,
        facilities,
      );
    });
  });
});
