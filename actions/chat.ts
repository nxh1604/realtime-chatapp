"use server";
export const sendMessage = async (formData: FormData) => {
  const sendMessage = formData.get("message") as string;
  const userId = formData.get("userId");
  const friendId = formData.get("friendId");
  if (!sendMessage) return { message: "ok", error: true };
  console.log(sendMessage.split(""));
  console.log({ sendMessage, userId, friendId });
  try {
    return { message: "ok", error: false };
  } catch (error) {
    return { message: "ok", error: true };
  }
};
