import { Shift, Facility } from '@prisma/client';
import prisma from '../prisma';
import { WorkerWithDocuments } from './workerStore';

const getEligibleShifts = async (
  worker: WorkerWithDocuments,
  facilities: Facility[],
  cursor?: number,
  pageSize = 10,
): Promise<Shift[]> => {
  const facilitiyIds = facilities.map(({ id }) => id);
  return prisma.shift.findMany({
    skip: cursor ? 1 : 0,
    take: pageSize,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    where: {
      is_deleted: false, // The `Shift` must be active (i.e., not deleted)
      worker_id: null, // The `Shift` must not be claimed by someone else
      profession: worker.profession, // The professions between the `Shift` and `Worker` must match
      facility_id: {
        in: facilitiyIds, // The `Shift` must be at one of the `Worker`'s facilities
      },
    },
    orderBy: { id: 'asc' },
  });
};

export default {
  getEligibleShifts,
};
