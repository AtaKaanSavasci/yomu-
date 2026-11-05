CREATE TABLE `yomu_sync` (
	`user_id` text PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`updated_at` text NOT NULL
);
