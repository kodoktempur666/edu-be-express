import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  unique,
  time,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const teacherTypeEnum = pgEnum("teacher_type", [
  "freelance",
  "permanent",
]);
export const bankEnum = pgEnum("bank", [
  "bri",
  "bni",
  "mandiri",
  "bca",
  "bsi",
  "cimb",
  "danamon",
  "maybank",
  "ocbc",
  "uob",
  "bjb",
  "panin",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userVerified: boolean("user_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("user_role").notNull().default("user"),

  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});


export const usersRelations = relations(users, ({ many }) => ({
  studentEnrollments: many(studentEnrollments),
}));


export const teachers = pgTable("teachers", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number").notNull(),
  bank: bankEnum("bank").notNull(),
  bankAccountNumber: text("bank_account_number").notNull(),
  teacherType: teacherTypeEnum("teacher_type").notNull(),
  image: text("image"),
  userVerified: boolean("user_verified").notNull().default(false),

  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const teachersRelations = relations(teachers, ({ many }) => ({
  schedules: many(schedules),
  teacherAttendances: many(teacherAttendances),
}));

export const courses = pgTable("courses", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: text("title").notNull(),
  rating: integer("rating"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  schedules: many(schedules),
  studentEnrollments: many(studentEnrollments),
}));

export const schedules = pgTable("schedules", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    teacherId: uuid("teacher_id").references(() => teachers.id, { onDelete: "cascade" }).notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    date: timestamp("date", { mode: "date" }).notNull(),
    rating: integer("rating"),
    teacherFee: integer("teacher_fee").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  course: one(courses, {
    fields: [schedules.courseId],
    references: [courses.id],
  }),
  teacher: one(teachers, {
    fields: [schedules.teacherId],
    references: [teachers.id],
  }),
  teacherAttendances: many(teacherAttendances),
}));

export const teacherAttendances = pgTable('teacher_attendances', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  scheduleId: uuid('schedule_id').references(() => schedules.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  timeArrive: timestamp('time_arrive').notNull(),
  delayMinutes: integer('delay_minutes'),
  attendanceTime: timestamp('attendance_time').defaultNow().notNull(),
  isAttended: boolean('is_attended').default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}, (t) => ({
  unqTeacherSchedule: unique('unq_teacher_schedule').on(t.scheduleId, t.teacherId),
}));

export const teacherAttendancesRelations = relations(teacherAttendances, ({ one }) => ({
  schedule: one(schedules, {
    fields: [teacherAttendances.scheduleId],
    references: [schedules.id],
  }),
  teacher: one(teachers, {
    fields: [teacherAttendances.teacherId],
    references: [teachers.id],
  }),
}));

export const studentEnrollments = pgTable('student_enrollments', {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    enrollmentDate: timestamp("enrollment_date", { mode: "date" }).notNull(),
}, (t) => ({
    unqUserCourse: unique('unq_user_course').on(t.userId, t.courseId),
}))

export const studentEnrollmentsRelations = relations(studentEnrollments, ({ one }) => ({
  user: one(users, {
    fields: [studentEnrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [studentEnrollments.courseId],
    references: [courses.id],
  }),
}));

export const teacherPayments = pgTable('teacher_payments', {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    teacherId: uuid("teacher_id").references(() => teachers.id, { onDelete: "cascade" }).notNull(),
    totalPayment: integer("total_payment"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export const teacherPaymentsRelations = relations(teacherPayments, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherPayments.teacherId],
    references: [teachers.id],
  }),
}));
