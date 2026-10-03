import { z } from "zod";

const entryType = z.enum(["PRE_WORKOUT", "WORKOUT", "POST_WORKOUT", "MISC"]);

const entryDatetime = z.iso
  .datetime({ offset: true, error: "Invalid date and time" })
  .transform((value) => new Date(value));

const mood = z
  .number()
  .int()
  .min(1, "Mood must be between 1 and 5")
  .max(5, "Mood must be between 1 and 5")
  .nullable();

const content = z
  .string()
  .max(5000, "Notes must be 5000 characters or fewer")
  .nullable();

// exactOptional (rather than optional) keeps the inferred types compatible with
// Prisma's inputs under exactOptionalPropertyTypes.
export const createEntrySchema = z.object({
  entry_type: entryType,
  entry_datetime: entryDatetime,
  mood: mood.exactOptional(),
  content: content.exactOptional(),
});

export const updateEntrySchema = z.object({
  entry_type: entryType.exactOptional(),
  entry_datetime: entryDatetime.exactOptional(),
  mood: mood.exactOptional(),
  content: content.exactOptional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
