import {z} from 'zod';

export const signInSchema = z.object({
  identifer: z.string().min(2, 'Identifier must be at least 2 characters long').max(50, 'Identifier must be at most 50 characters long'),
  password: z.string().min(6, {message:'Password must be at least 6 characters long'}),
});
