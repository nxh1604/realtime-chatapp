import { z } from "zod";

export const friendRequestValidator = z.object({
  friendId: z.string(),
});

export type FriendRequestDataType = z.infer<typeof friendRequestValidator>;
