import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
// One bounded snapshot per signed-in Site user; optimistic revisions prevent lost updates.
export const yomuSync=sqliteTable('yomu_sync',{
 userId:text('user_id').primaryKey().notNull(),
 revision:integer('revision').notNull(),
 snapshot:text('snapshot').notNull(),
 updatedAt:text('updated_at').notNull()
});
