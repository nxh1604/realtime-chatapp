"use server";
export const sendMessage = async (prevState: { message: string; error: boolean }, formData: FormData) => {
  const sendMessage = formData.get("message");
  console.log(sendMessage);

  return { message: "ok", error: false };
};
