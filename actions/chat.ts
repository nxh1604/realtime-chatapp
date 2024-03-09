"use server";
export const sendMessage = async (prevState: { message: string; error: boolean }, formData: FormData) => {
  const sendMessage = formData.get("message");
  const userId = formData.get("userId");
  const friendId = formData.get("friendId");
  console.log({ sendMessage, userId, friendId });
  try {
    return { message: "ok", error: false };
  } catch (error) {
    return { message: "ok", error: true };
  }
};
