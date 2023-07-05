import { createClient } from 'redis';
import createLogger from '../logger';

const logger = createLogger('redisCache.ts');
const client = createClient();

const disabled = process.env.REDIS_DISABLED === 'true';

client.on('error', (err) => {
  logger.error('Redis error: ', err);
  throw new Error(err);
});

if (!disabled) {
  client.connect();
}

const get = async <T>(key: string): Promise<T | null> => {
  if (disabled) return null;

  const data = await client.get(key);

  if (!data) return null;

  return JSON.parse(data);
};

const set = async <T>(
  key: string,
  data: T,
  expirationInSeconds = 3600,
): Promise<void> => {
  if (disabled) return;

  const serializedData = JSON.stringify(data);

  await client.setEx(key, expirationInSeconds, serializedData);
};

export default {
  get,
  set,
};
