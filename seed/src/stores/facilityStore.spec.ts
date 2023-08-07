import { Facility, PrismaClient } from '@prisma/client';
import facilityStore from './facilityStore';
import { WorkerWithDocumentsAndShifts } from './workerStore';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    facility: {
      findMany: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const worker: WorkerWithDocumentsAndShifts = {
  id: 1,
  name: 'Ada Lovelace',
  is_active: true,
  profession: 'CNA',
  documents: [],
  shifts: [],
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

describe('facilityStore', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFacilitiesOfWorker', () => {
    it('should return a list of available facilities for a given worker', async () => {
      prisma.facility.findMany.mockResolvedValueOnce(facilities);

      const result = await facilityStore.getFacilitiesOfWorker(worker);

      expect(result).toEqual(facilities);
      expect(prisma.facility.findMany).toHaveBeenCalledWith({
        where: {
          is_active: true,
          requirements: {
            every: {
              document_id: { in: [] },
            },
          },
        },
      });
    });
  });
});
