CREATE TABLE "subcategories" (
	"id" varchar PRIMARY KEY NOT NULL,
	"category_id" varchar,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory_id" varchar;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "subcategories";