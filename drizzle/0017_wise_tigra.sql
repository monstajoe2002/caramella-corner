ALTER TABLE "accounts" RENAME COLUMN "customer_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "customer_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_customer_id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_customer_id_customers_id_fk";
--> statement-breakpoint
DROP INDEX "accounts_customerId_idx";--> statement-breakpoint
DROP INDEX "sessions_customerId_idx";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_customers_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_customers_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" USING btree ("user_id");