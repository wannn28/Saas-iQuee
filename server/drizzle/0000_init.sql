CREATE TABLE `contact_messages` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`company` varchar(160),
	`topic` enum('sales','support','partnership','other') NOT NULL DEFAULT 'sales',
	`message` text NOT NULL,
	`handled` boolean NOT NULL DEFAULT false,
	`ip_hash` char(64),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waitlist_signups` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`clinic` varchar(160) NOT NULL,
	`team_size` enum('solo','2-8','9-25','26+') NOT NULL,
	`source` varchar(40) NOT NULL DEFAULT 'landing',
	`ip_hash` char(64),
	`user_agent` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `waitlist_signups_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_waitlist_email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `idx_contact_created` ON `contact_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_waitlist_created` ON `waitlist_signups` (`created_at`);