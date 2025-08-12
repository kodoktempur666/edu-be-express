import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import config from "../../src/config";
import redisClient from "../utils/redisClient";

// export async function verifyToken(req: Request, res: Response, next: NextFunction) {
//     const token = req.header('Authorization');

//     if (!token) {
//         res.status(401).json({ error: 'Access denied' });
//         return;
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET );
//         if (typeof decoded !== 'object' || !decoded?.userId) {
//             res.status(401).json({ error: 'Access denied' });
//             return;
//         }
//         req.id = decoded.id; // Assuming userId is a number

//         const getRole = await db.select().from(users).where(eq(users.id, decoded.id));
//         const role = getRole[0].role;

//         req.role = role;

//         next();
//     } catch (e) {
//         res.status(401).json({ error: 'Access denied' });
//         return;
//     }
// }

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const payload = jwt.verify(token, config.env.jwtPublicSecret, {
      algorithms: ["RS256"],
    });
    const stored = await redisClient.get(`auth:token:${payload.id}`);
    if (!stored || stored !== token) {
      return res.status(401).json({ message: "Token revoked or invalid" });
    }

    
    //@ts-ignore
    req.id = payload.id;

    const getRole = await db
      .select()
      .from(users)
      .where(eq(users.id, req.id));
    req.role = getRole[0]?.role;
    console.log({ id : req.id, role : req.role })
    next();
  } catch (e) {
    return res.status(401).json({ error: "Access denied" });
  }
}
