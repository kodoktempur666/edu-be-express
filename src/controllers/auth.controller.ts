import { Request, Response } from "express";
import { db } from "../db/index";
import bcrypt from "bcryptjs";
import { users, teachers } from "../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import config from "../../src/config";
import redisClient from "../utils/redisClient";

export async function signUpUser(req: Request, res: Response) {
  try {
    const data = req.cleanBody;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    data.password = await bcrypt.hash(data.password, 10);

    const [user] = await db.insert(users).values(data).returning();

    //@ts-ignore
    user.password = undefined;

    res.status(201).json({ id: user.id });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

export async function signUpTeacher(req: Request, res: Response) {
  try {
    const data = req.cleanBody;

    const existingUser = await db
      .select()
      .from(teachers)
      .where(eq(teachers.email, data.email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    data.password = await bcrypt.hash(data.password, 10);

    const [teacher] = await db.insert(teachers).values(data).returning();

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

export async function signInUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const privateKey = config.env.jwtPrivateSecret;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ message: "Email or password wrong" });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).json({ message: "Email or password wrong" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    });

    // Simpan token di Redis agar bisa di-revoke/cek
    // Key pattern: auth:token:<userId> => token
    const ttlSeconds = 30 * 24 * 60 * 60; // 30 hari
    await redisClient.set(`auth:token:${user.id}`, token, "EX", ttlSeconds);

    // Simpan token ke cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: true, // Tidak bisa diakses dari JavaScript di browser
      secure: process.env.NODE_ENV === "production", // hanya lewat HTTPS kalau production
      sameSite: "strict", // cegah CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
    });

    res.status(200).json({
      id: user.id,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function signOutUser(req: Request, res: Response) {
  try {
    const token = req.cookies?.token;
    if (token) {
      // decode untuk dapatkan id
      const payload: any = jwt.decode(token);
      if (payload?.id) {
        await redisClient.del(`auth:token:${payload.id}`);
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Signed out" });
  } catch (err) {
    console.error("Sign out error:", err);
    res.status(500).send("Internal Server Error");
  }
}