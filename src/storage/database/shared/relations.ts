import { relations } from "drizzle-orm/relations";
import { courses, chapters, users, learningProgress, questions, examRecords, certificates, orders } from "./schema";

export const chaptersRelations = relations(chapters, ({one, many}) => ({
	course: one(courses, {
		fields: [chapters.courseId],
		references: [courses.id]
	}),
	learningProgresses: many(learningProgress),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	chapters: many(chapters),
	learningProgresses: many(learningProgress),
	questions: many(questions),
}));

export const learningProgressRelations = relations(learningProgress, ({one}) => ({
	user: one(users, {
		fields: [learningProgress.userId],
		references: [users.id]
	}),
	course: one(courses, {
		fields: [learningProgress.courseId],
		references: [courses.id]
	}),
	chapter: one(chapters, {
		fields: [learningProgress.chapterId],
		references: [chapters.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	learningProgresses: many(learningProgress),
	examRecords: many(examRecords),
	certificates: many(certificates),
	orders: many(orders),
}));

export const questionsRelations = relations(questions, ({one}) => ({
	course: one(courses, {
		fields: [questions.courseId],
		references: [courses.id]
	}),
}));

export const examRecordsRelations = relations(examRecords, ({one}) => ({
	user: one(users, {
		fields: [examRecords.userId],
		references: [users.id]
	}),
}));

export const certificatesRelations = relations(certificates, ({one}) => ({
	user: one(users, {
		fields: [certificates.userId],
		references: [users.id]
	}),
}));

export const ordersRelations = relations(orders, ({one}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
}));