import { ServerClient } from "postmark";

export const SendShareEmail = async (senderEmail: string, recipientEmail: string) => {
    const client = new ServerClient(process.env.POSTMARK_API_TOKEN!);

    client.sendEmail({
        "From": `${process.env.POSTMARK_SERVER_EMAIL}`,
        "To": `${recipientEmail}`,
        "Subject": "Test",
        "TextBody": "Test email"
    });
}