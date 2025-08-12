// middlewares/rateLimiter.middleware.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../utils/redisClient";

export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: any[]) => (redisClient as any).call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // limit 5 request per window per IP
  message: "Too many login attempts from this IP, please try again later.",
  legacyHeaders: false,
  standardHeaders: true,
});
