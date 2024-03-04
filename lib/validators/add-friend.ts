import { z } from "zod";

export const addFriendValidator = z.object({
  email: z.string().email(),
});

export type AddFriendDataType = z.infer<typeof addFriendValidator>;
