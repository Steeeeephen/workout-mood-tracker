import { z } from "zod";

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} cannot be empty`)
    .max(100, `${label} must be 100 characters or fewer`);

const email = z.email("Invalid email format").max(254);

// bcrypt only uses the first 72 bytes of a password, so cap it there.
const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or fewer.");

export const registerSchema = z.object({
  first_name: name("First name"),
  last_name: name("Last name"),
  email,
  password,
});

// Login only checks presence so accounts created before validation existed
// can still sign in.
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  first_name: name("First name").optional(),
  last_name: name("Last name").optional(),
  email: email.optional(),
  password: password.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
