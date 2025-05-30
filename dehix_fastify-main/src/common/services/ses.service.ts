/**
 * File: ses.service.ts
 * Author: Akhil
 * Date: 29-04-2024
 * Description: Simple email service class file
 */

import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
  SendEmailCommandOutput,
} from "@aws-sdk/client-ses";
import { Service } from "fastify-decorators";

@Service()
export class SESService {
  private readonly sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: process.env.REGION });
  }

  /**
   * method to send
   * @param param0
   * @returns
   */
  async sendEmail({
    sender = process.env.EMAIL_SENDER!,
    recipient,
    subject,
    textBody,
  }: {
    sender: string;
    recipient: string[];
    subject: string;
    textBody: string;
  }): Promise<SendEmailCommandOutput> {
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: recipient,
      },
      Message: {
        Body: {
          Text: {
            Data: textBody,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: sender,
    };
    const command = new SendEmailCommand(params);
    const response = await this.sesClient.send(command);
    return response;
  }
}
