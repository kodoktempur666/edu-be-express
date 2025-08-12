CREATE TYPE "public"."bank" AS ENUM('bri', 'bni', 'mandiri', 'bca', 'bsi', 'cimb', 'danamon', 'maybank', 'ocbc', 'uob', 'bjb', 'panin');--> statement-breakpoint
CREATE TYPE "public"."teacher_type" AS ENUM('freelance', 'permanent');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"rating" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"date" timestamp NOT NULL,
	"rating" integer,
	"teacher_fee" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schedules_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "student_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"enrollment_date" timestamp NOT NULL,
	CONSTRAINT "student_enrollments_id_unique" UNIQUE("id"),
	CONSTRAINT "unq_user_course" UNIQUE("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "teacher_attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"time_arrive" timestamp NOT NULL,
	"delay_minutes" integer,
	"attendance_time" timestamp DEFAULT now() NOT NULL,
	"is_attended" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_attendances_id_unique" UNIQUE("id"),
	CONSTRAINT "unq_teacher_schedule" UNIQUE("schedule_id","teacher_id")
);
--> statement-breakpoint
CREATE TABLE "teacher_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"total_payment" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_payments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"phone_number" text NOT NULL,
	"bank" "bank" NOT NULL,
	"bank_account_number" text NOT NULL,
	"teacher_type" "teacher_type" NOT NULL,
	"image" text,
	"reset_token" text,
	"reset_token_expiry" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teachers_id_unique" UNIQUE("id"),
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"user_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"user_role" "user_role" DEFAULT 'user' NOT NULL,
	"reset_token" text,
	"reset_token_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_attendances" ADD CONSTRAINT "teacher_attendances_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_attendances" ADD CONSTRAINT "teacher_attendances_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_payments" ADD CONSTRAINT "teacher_payments_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;