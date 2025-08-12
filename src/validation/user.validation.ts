import { createInsertSchema } from "drizzle-zod";
import { users } from "../db/schema";
import { z } from "zod";

export const createUserSchema = createInsertSchema(users).omit({
  role: true,
  resetToken: true,
  resetTokenExpiry: true,
  createdAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});