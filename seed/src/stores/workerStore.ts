import { DocumentWorker, Shift, Worker } from '@prisma/client';
import prisma from '../prisma';

export type WorkerWithDocumentsAndShifts = Worker & {
  documents: DocumentWorker[];
  shifts: Shift[];
};

const getWorkerWithDocumentsAndShifts = async (
  workerId: number,
): Promise<WorkerWithDocumentsAndShifts | null> => {
  return prisma.worker.findUnique({
    where: { id: workerId },
    include: {
      documents: true,
      shifts: true,
    },
  });
};

export default {
  getWorkerWithDocumentsAndShifts,
};
