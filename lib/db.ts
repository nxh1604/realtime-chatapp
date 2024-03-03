import { Redis, RedisConfigNodejs } from "@upstash/redis";

const redisObject: RedisConfigNodejs = {
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
};

const redis = new Redis(redisObject);

export default redis;
