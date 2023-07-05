import { config } from 'dotenv';

config();

jest.doMock('redis', () => ({
  createClient: () => ({
    get: jest.fn(),
    setEx: jest.fn(),
    connect: jest.fn(),
    on: jest.fn(),
  }),
}));
