import { createInsertSchema } from "drizzle-zod";
import {
  pgTable,
  text,
  timestamp,
  foreignKey,
  index,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const feedbackTable = pgTable(
  "feedback",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    ownerForeignKey: foreignKey({
      columns: [table.ownerId],
      foreignColumns: [usersTable.id],
      name: "feedback_owner_id_users_id_fk",
    }).onDelete("cascade"),
    ownerCreatedAtIndex: index("feedback_owner_created_at_idx").on(
      table.ownerId,
      table.createdAt,
    ),
  }),
);

export const insertFeedbackSchema = createInsertSchema(feedbackTable).omit({
  createdAt: true,
});
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbackTable.$inferSelect;