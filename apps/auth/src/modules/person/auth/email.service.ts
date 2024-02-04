import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {}

  async sendEmail(
    to: string,
    subject: string,
    templateRelativeAddress: string,
    contexts: Record<string, string | number | boolean>,
  ): Promise<void> {
    try {
      // @todo vahidnejad complete this logic with email module
      console.log('send email')
    } catch (e) {
      console.log('error', e);
    }
  }
}
