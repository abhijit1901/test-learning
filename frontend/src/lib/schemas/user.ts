import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

export const usersSchema = z.array(userSchema);

export const createUserInputSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters")
});

export const updateUserInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters")
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
