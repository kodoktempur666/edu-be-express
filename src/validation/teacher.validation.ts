import { createInsertSchema } from "drizzle-zod";
import { teachers } from "../db/schema";
import { z } from "zod";

export const createTeacherSchema = createInsertSchema(teachers).omit({
    resetToken: true,
    resetTokenExpiry: true,
    createdAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  bankAccountNumber: z.string().min(10, "Bank account number must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const teacherSignInSchema = createInsertSchema(teachers).pick({
  email: true,
  password: true,
})