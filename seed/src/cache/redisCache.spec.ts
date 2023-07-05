jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

let mockGet: jest.Mock;
let mockSetEx: jest.Mock;

beforeEach(() => {
  jest.resetModules();

  mockGet = jest.fn();
  mockSetEx = jest.fn();

  jest.doMock('redis', () => ({
    createClient: () => ({
      get: mockGet,
      setEx: mockSetEx,
      connect: jest.fn(),
      on: jest.fn(),
    }),
  }));
});

describe('redisCache', () => {
  describe('get', () => {
    it('should return data when key is present', async () => {
      const redisCache = require('./redisCache').default;
      const key = 'key';
      const value = { field: 'value' };
      mockGet.mockResolvedValueOnce(JSON.stringify(value));

      const result = await redisCache.get(key);

      expect(mockGet).toBeCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return null when key is not present', async () => {
      const redisCache = require('./redisCache').default;
      const key = 'key';
      mockGet.mockResolvedValueOnce(null);

      const result = await redisCache.get(key);

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data with provided expiration time', async () => {
      const redisCache = require('./redisCache').default;
      const key = 'key';
      const value = { field: 'value' };
      const expiration = 5000;

      await redisCache.set(key, value, expiration);

      expect(mockSetEx).toBeCalledWith(key, expiration, JSON.stringify(value));
    });

    it('should set data with default expiration time when no expiration is provided', async () => {
      const redisCache = require('./redisCache').default;
      const key = 'key';
      const value = { field: 'value' };

      await redisCache.set(key, value);

      expect(mockSetEx).toBeCalledWith(key, 3600, JSON.stringify(value));
    });
  });
});
