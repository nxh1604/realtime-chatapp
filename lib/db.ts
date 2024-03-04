import { Redis, RedisConfigNodejs } from "@upstash/redis";

const redisObject: RedisConfigNodejs = {
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
};

if (!redisObject.url || !redisObject.token) {
  throw new Error("Missing environment variable UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

const redis = new Redis(redisObject);

export default redis;
