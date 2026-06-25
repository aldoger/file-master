import { MessageMedia, Client } from "whatsapp-web.js";

export async function sendToEmail(email, filepath) {}

export async function sendToWhatsapp(phoneNumber, filePath) {
  const client = new Client();

  try {
    const media = MessageMedia.fromFilePath(filePath);
    await client.sendMessage(phoneNumber, media);
  } catch (e) {
    return e;
  }
}
