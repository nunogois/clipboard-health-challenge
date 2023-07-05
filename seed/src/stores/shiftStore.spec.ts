import { Facility, PrismaClient, Shift } from '@prisma/client';
import shiftStore from './shiftStore';
import { WorkerWithDocuments } from './workerStore';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    shift: {
      findMany: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

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

describe('shiftStore', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEligibleShifts', () => {
    const cursor = 2;
    const pageSize = 5;

    it('should return a list of eligible shifts for a given worker', async () => {
      prisma.shift.findMany.mockResolvedValueOnce(shifts);

      const result = await shiftStore.getEligibleShifts(
        worker,
        facilities,
        cursor,
        pageSize,
      );

      expect(result).toEqual(shifts);
      expect(prisma.shift.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: pageSize,
        cursor: { id: cursor },
        where: {
          is_deleted: false,
          worker_id: null,
          profession: worker.profession,
          facility_id: {
            in: facilities.map(({ id }) => id),
          },
        },
        orderBy: { id: 'asc' },
      });
    });
  });
});
