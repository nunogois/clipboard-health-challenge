import { PrismaClient, Worker } from '@prisma/client';
import workerStore from './workerStore';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    worker: {
      findUnique: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const worker: Worker = {
  id: 1,
  name: 'Ada Lovelace',
  is_active: true,
  profession: 'CNA',
};

describe('workerStore', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWorker', () => {
    it('should return a worker when a valid workerId is provided', async () => {
      prisma.worker.findUnique.mockResolvedValueOnce(worker);

      const result = await workerStore.getWorkerWithDocumentsAndShifts(
        worker.id,
      );

      expect(result).toEqual(worker);
      expect(prisma.worker.findUnique).toHaveBeenCalledWith({
        where: { id: worker.id },
        include: { documents: true },
      });
    });

    it('should return null when no worker with the given workerId exists', async () => {
      const workerId = 1;

      prisma.worker.findUnique.mockResolvedValueOnce(null);

      const result = await workerStore.getWorkerWithDocumentsAndShifts(
        workerId,
      );

      expect(result).toBeNull();
      expect(prisma.worker.findUnique).toHaveBeenCalledWith({
        where: { id: workerId },
        include: { documents: true },
      });
    });
  });
});
