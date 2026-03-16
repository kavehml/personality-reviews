import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const quizAnswerSchema = z.object({
  questionId: z.number().int().min(0),
  answerIndex: z.number().int().min(0),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(2000),
  tags: z.array(z.enum(["service", "value", "ambience", "adventurous", "healthy"])).optional(),
});

export const interestsSchema = z.object({
  interests: z.array(z.enum(["value", "ambience", "service", "adventurous", "healthy"])),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only"),
  description: z.string().max(200).optional(),
});

export const createLocationSchema = z.object({
  name: z.string().min(2).max(100),
  city: z.string().min(2).max(80),
  categorySlug: z.string().min(2).max(50),
  detail: z.string().min(2).max(80),
  description: z.string().min(5).max(500),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export const INTEREST_OPTIONS = ["value", "ambience", "service", "adventurous", "healthy"] as const;
export const TAG_OPTIONS = ["service", "value", "ambience", "adventurous", "healthy"] as const;
