import 'dotenv/config'
import {boolean, pgTable, uuid, varchar} from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
    id: uuid().primaryKey(),
    name: varchar({length: 255}).notNull(),
    completed: boolean().notNull(),
    createdBy: varchar({length: 255}).notNull(),
})
