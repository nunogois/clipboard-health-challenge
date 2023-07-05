import request from 'supertest';
import app from '../app';
import { Worker, PrismaClient, Profession, Shift } from '@prisma/client';

const maxDocuments = 10;

const prisma = new PrismaClient();

describe('Shift Routes', () => {
  let worker: Worker;

  beforeAll(async () => {
    worker = await prisma.worker.create({
      data: {
        name: 'Deterministic #1',
        profession: Profession.CNA,
        is_active: true,
      },
    });
    const workerDocuments = Array.from(
      { length: maxDocuments },
      (_, i) => i + 1,
    ).map((number) => ({ worker_id: worker.id, document_id: number }));
    await prisma.documentWorker.createMany({ data: workerDocuments });
  });

  describe('GET /shifts/available/:workerId', () => {
    it('should return a list of available shifts for a worker', async () => {
      const res = await request(app)
        .get(`/shifts/available/${worker.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((shift: Shift) => {
        expect(shift.is_deleted).toBe(false);
        expect(shift.worker_id).toBeNull();
        expect(shift.profession).toEqual(worker.profession);
      });
    });

    it('should return a 404 for a worker that does not exist', async () => {
      const nonExistentWorkerId = 999999;
      const res = await request(app)
        .get(`/shifts/available/${nonExistentWorkerId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Worker with id 999999 not found');
    });
  });
});
