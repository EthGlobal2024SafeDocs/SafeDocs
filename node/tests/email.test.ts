import { ServerClient } from "postmark";
import * as dotenv from "dotenv";

describe("sending an email using postmark", () => {
    beforeAll(() => {
        dotenv.config();
    });
    it("create client with postmark and send test email", async () => {
        const client = new ServerClient(process.env.POSTMARK_API_TOKEN!);

        const sentEmail = await client.sendEmail({
            "From": `${process.env.POSTMARK_SERVER_EMAIL}`,
            "To": "broden.suffern24@gmail.com",
            "Subject": "Test email for SafeDocs development",
            "TextBody": "Hi Broden, it's Broden testing using Postmark to send an email."
        });

        const { Message } = sentEmail;

        expect(Message).toBe('OK');
    });
});