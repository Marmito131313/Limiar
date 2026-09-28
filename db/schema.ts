import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const archives = sqliteTable('archives', {userId:text('user_id').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1)});
export const books = sqliteTable('books', {id:text('id').primaryKey(),userId:text('user_id').notNull(),bookKey:text('book_key').notNull(),name:text('name').notNull(),objectKey:text('object_key').notNull()});
export const sharedCampaigns = sqliteTable('shared_campaigns', {code:text('code').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1)});
