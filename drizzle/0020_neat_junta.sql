CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_description_idx" ON "products" USING btree ("description");--> statement-breakpoint
CREATE INDEX "products_material_idx" ON "products" USING btree ("material");--> statement-breakpoint
CREATE INDEX "products_active_idx" ON "products" USING btree ("active");