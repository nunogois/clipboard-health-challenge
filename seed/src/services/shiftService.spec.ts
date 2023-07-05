import { Shift } from '@prisma/client';
import shiftService from '../services/shiftService';
import workerStore, { WorkerWithDocuments } from '../stores/workerStore';
import facilityStore from '../stores/facilityStore';
import shiftStore from '../stores/shiftStore';
import redisCache from '../cache/redisCache';
import { NotFoundError } from '../errors/notFoundError';

jest.mock('../stores/workerStore');
jest.mock('../stores/facilityStore');
jest.mock('../stores/shiftStore');
jest.mock('../cache/redisCache');

const worker: WorkerWithDocuments = {
  id: 1,
  name: 'Ada Lovelace',
  is_active: true,
  profession: 'CNA',
  documents: [],
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

const workerStoreMock = workerStore as jest.Mocked<typeof workerStore>;
const shiftStoreMock = shiftStore as jest.Mocked<typeof shiftStore>;
const facilityStoreMock = facilityStore as jest.Mocked<typeof facilityStore>;
const redisCacheMock = redisCache as jest.Mocked<typeof redisCache>;

describe('shiftService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAvailableShifts', () => {
    it('should return eligible shifts for a valid worker ID with active worker and no cached shifts', async () => {
      workerStoreMock.getWorkerWithDocuments.mockResolvedValueOnce(worker);
      facilityStoreMock.getFacilitiesOfWorker.mockResolvedValueOnce([]);
      shiftStoreMock.getEligibleShifts.mockResolvedValueOnce(shifts);

      const availableShifts = await shiftService.getAllAvailableShifts(1);

      expect(availableShifts).toEqual(shifts);
      expect(workerStore.getWorkerWithDocuments).toHaveBeenCalledWith(1);
      expect(facilityStore.getFacilitiesOfWorker).toHaveBeenCalledWith(worker);
      expect(shiftStore.getEligibleShifts).toHaveBeenCalledWith(
        worker,
        [],
        undefined,
      );
      expect(redisCache.set).toHaveBeenCalledWith('shifts:1:0', shifts);
    });
    it('should return cached shifts for a valid worker ID with active worker and existing cached shifts', async () => {
      workerStoreMock.getWorkerWithDocuments.mockResolvedValueOnce(worker);
      shiftStoreMock.getEligibleShifts.mockResolvedValueOnce(shifts);
      redisCacheMock.get.mockResolvedValueOnce(shifts);

      const availableShifts = await shiftService.getAllAvailableShifts(1);

      expect(availableShifts).toEqual(shifts);
      expect(workerStore.getWorkerWithDocuments).toHaveBeenCalledWith(1);
      expect(facilityStore.getFacilitiesOfWorker).not.toHaveBeenCalled();
      expect(shiftStore.getEligibleShifts).not.toHaveBeenCalled();
      expect(redisCache.get).toHaveBeenCalledWith('shifts:1:0');
      expect(redisCache.set).not.toHaveBeenCalled();
    });
    it('should throw an error for an invalid worker ID', async () => {
      workerStoreMock.getWorkerWithDocuments.mockResolvedValueOnce(null);

      await expect(shiftService.getAllAvailableShifts(1)).rejects.toThrowError(
        NotFoundError,
      );

      expect(workerStore.getWorkerWithDocuments).toHaveBeenCalledWith(1);
      expect(facilityStore.getFacilitiesOfWorker).not.toHaveBeenCalled();
      expect(shiftStore.getEligibleShifts).not.toHaveBeenCalled();
      expect(redisCache.get).not.toHaveBeenCalled();
      expect(redisCache.set).not.toHaveBeenCalled();
    });
  });
});
