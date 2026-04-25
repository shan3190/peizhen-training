import { pgTable, serial, timestamp, index, varchar, text, integer, boolean, foreignKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const courses = pgTable("courses", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	coverImage: text("cover_image"),
	duration: integer().default(0),
	orderIndex: integer("order_index").default(0),
	isRequired: boolean("is_required").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("courses_order_idx").using("btree", table.orderIndex.asc().nullsLast().op("int4_ops")),
]);

export const chapters = pgTable("chapters", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	courseId: varchar("course_id", { length: 36 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	content: text(),
	videoUrl: text("video_url"),
	duration: integer().default(0),
	orderIndex: integer("order_index").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("chapters_course_idx").using("btree", table.courseId.asc().nullsLast().op("text_ops")),
	index("chapters_order_idx").using("btree", table.orderIndex.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "chapters_course_id_fkey"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	phone: varchar({ length: 20 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 100 }),
	idCard: varchar("id_card", { length: 20 }),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("users_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("users_phone_idx").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	unique("users_phone_key").on(table.phone),
]);

export const learningProgress = pgTable("learning_progress", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	courseId: varchar("course_id", { length: 36 }).notNull(),
	chapterId: varchar("chapter_id", { length: 36 }).notNull(),
	isCompleted: boolean("is_completed").default(false),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("progress_course_idx").using("btree", table.courseId.asc().nullsLast().op("text_ops")),
	index("progress_user_course_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.courseId.asc().nullsLast().op("text_ops")),
	index("progress_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "learning_progress_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "learning_progress_course_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "learning_progress_chapter_id_fkey"
		}).onDelete("cascade"),
]);

export const questions = pgTable("questions", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	courseId: varchar("course_id", { length: 36 }),
	type: varchar({ length: 20 }).notNull(),
	question: text().notNull(),
	options: text().notNull(),
	correctAnswer: text("correct_answer").notNull(),
	explanation: text(),
	difficulty: integer().default(1),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("questions_course_idx").using("btree", table.courseId.asc().nullsLast().op("text_ops")),
	index("questions_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "questions_course_id_fkey"
		}).onDelete("cascade"),
]);

export const examRecords = pgTable("exam_records", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	score: integer().default(0),
	totalQuestions: integer("total_questions").default(50),
	correctCount: integer("correct_count").default(0),
	isPassed: boolean("is_passed").default(false),
	questionIds: text("question_ids"),
	answers: text(),
	examCount: integer("exam_count").default(1),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("exam_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("exam_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "exam_records_user_id_fkey"
		}).onDelete("cascade"),
]);

export const certificates = pgTable("certificates", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	certificateNo: varchar("certificate_no", { length: 50 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	idCard: varchar("id_card", { length: 20 }).notNull(),
	issueDate: timestamp("issue_date", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiryDate: timestamp("expiry_date", { withTimezone: true, mode: 'string' }),
	status: varchar({ length: 20 }).default('active'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("cert_no_idx").using("btree", table.certificateNo.asc().nullsLast().op("text_ops")),
	index("cert_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "certificates_user_id_fkey"
		}).onDelete("cascade"),
	unique("certificates_certificate_no_key").on(table.certificateNo),
]);

export const orders = pgTable("orders", {
	id: varchar({ length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	orderNo: varchar("order_no", { length: 50 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	amount: integer().notNull(),
	paymentMethod: varchar("payment_method", { length: 20 }),
	paymentStatus: varchar("payment_status", { length: 20 }).default('pending'),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("order_no_idx").using("btree", table.orderNo.asc().nullsLast().op("text_ops")),
	index("order_status_idx").using("btree", table.paymentStatus.asc().nullsLast().op("text_ops")),
	index("order_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_fkey"
		}).onDelete("cascade"),
	unique("orders_order_no_key").on(table.orderNo),
]);
