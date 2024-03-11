import { z } from "zod";

const sendMessageSchema = z.object({
  message: z.string(),
  userId: z.string(),
  friendId: z.string(),
});

export default sendMessageSchema;
