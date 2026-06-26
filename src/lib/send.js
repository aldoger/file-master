import { MessageMedia, Client } from "whatsapp-web.js";

export const PLATFORM = {
  WHATSSAPP: "whatsapp",
};

export async function sendToWhatsapp(phoneNumber, filePath) {
  const client = new Client();

  try {
    const media = MessageMedia.fromFilePath(filePath);
    await client.sendMessage(phoneNumber, media);
    return null;
  } catch (e) {
    return e;
  }
}
