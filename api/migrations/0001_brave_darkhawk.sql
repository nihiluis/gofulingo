CREATE TABLE "vocabulary_flashcard_log" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vocabulary_flashcard_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flashcardId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_flashcard" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vocabulary_flashcard_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vocabularyId" integer,
	"difficulty" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_flashcard_translation" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vocabulary_flashcard_translation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flashcardId" integer,
	"translation" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vocabulary" ADD COLUMN "translations" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_flashcard_log" ADD CONSTRAINT "vocabulary_flashcard_log_flashcardId_vocabulary_flashcard_id_fk" FOREIGN KEY ("flashcardId") REFERENCES "public"."vocabulary_flashcard"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_flashcard" ADD CONSTRAINT "vocabulary_flashcard_vocabularyId_vocabulary_id_fk" FOREIGN KEY ("vocabularyId") REFERENCES "public"."vocabulary"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_flashcard_translation" ADD CONSTRAINT "vocabulary_flashcard_translation_flashcardId_vocabulary_flashcard_id_fk" FOREIGN KEY ("flashcardId") REFERENCES "public"."vocabulary_flashcard"("id") ON DELETE no action ON UPDATE no action;