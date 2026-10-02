CREATE TYPE "public"."request_kind" AS ENUM('term-request', 'term-fix');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('requested', 'writing', 'in-review', 'published', 'rejected', 'needs-attention');--> statement-breakpoint
CREATE TABLE "question_attempts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "question_attempts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"term_id" text NOT NULL,
	"question_index" smallint NOT NULL,
	"chosen_index" smallint NOT NULL,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_terms" (
	"user_id" text NOT NULL,
	"term_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_terms_user_id_term_id_pk" PRIMARY KEY("user_id","term_id")
);
--> statement-breakpoint
CREATE TABLE "term_progress" (
	"user_id" text NOT NULL,
	"term_id" text NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"learned_at" timestamp with time zone,
	"last_answered_at" timestamp with time zone,
	CONSTRAINT "term_progress_user_id_term_id_pk" PRIMARY KEY("user_id","term_id")
);
--> statement-breakpoint
CREATE TABLE "term_requests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "term_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text,
	"kind" "request_kind" NOT NULL,
	"term" text NOT NULL,
	"term_id" text,
	"details" text,
	"status" "request_status" DEFAULT 'requested' NOT NULL,
	"github_issue" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "question_attempts_user_term_idx" ON "question_attempts" USING btree ("user_id","term_id");--> statement-breakpoint
CREATE INDEX "term_requests_user_idx" ON "term_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "term_requests_status_idx" ON "term_requests" USING btree ("status");