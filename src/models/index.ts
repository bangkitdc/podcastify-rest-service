import { PrismaClient } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();

let redisClient: RedisClientType;
const redis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
      }
    })

    redisClient.on('error', (err : Error) => {
      console.error(`Redis error: ${err}`);
    })

    await new Promise((resolve) => {
      redisClient.on('connect', () => {
        console.log('Connected to Redis');
        resolve(null);
      });
    });
  }

  return redisClient;
}

export {
  prisma,
  redis
};
