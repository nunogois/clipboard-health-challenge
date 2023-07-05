import { Facility } from '@prisma/client';
import prisma from '../prisma';
import { WorkerWithDocuments } from './workerStore';

const getFacilitiesOfWorker = async (
  worker: WorkerWithDocuments,
): Promise<Facility[] | null> => {
  const documentIds = worker.documents.map(({ document_id }) => document_id);

  return prisma.facility.findMany({
    where: {
      is_active: true, // The `Facility` must be active
      requirements: {
        every: {
          document_id: { in: documentIds }, // The `Worker` must have all of the facility's required documents
        },
      },
    },
  });
};

export default {
  getFacilitiesOfWorker,
};
