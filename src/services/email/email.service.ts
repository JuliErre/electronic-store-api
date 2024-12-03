import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const resendKey = process.env.RESEND_KEY;
    if (!resendKey) {
      console.error('RESEND_KEY environment variable is not set');
      throw new Error('RESEND_KEY environment variable is not set');
    }
    this.resend = new Resend(resendKey);
  }

  async sendEmail(email: string, subject: string, html: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'Electronic Store <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    });
    if (error) {
      console.error(error);
    }
    return data;
  }

  async sendProductPurchaseEmail(
    email: string,
    products: {
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      quantity: number;
    }[],
  ) {
    const html = this.generateProductEmailHtml(products);
    console.log(html);
    return this.sendEmail(email, 'Electronic Store Purchase', html);
  }

  private generateProductEmailHtml(
    products: {
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      quantity: number;
    }[],
  ): string {
    const productItems = products
      .map(
        (product) => `
          <div style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; align-items: center;">
            <div style="display: flex; height: 100px; padding-top:20px">
             <img src="${product.imageUrl}" alt="${product.name} (Image may not display)" style="width: 100px; height: auto; vertical-align: middle; margin-right: 20px;" />
            </div>
            <div>
              <h2 style="color: #333;">${product.name}</h2>
              <p style="color: #777;">${product.description}</p>
              <strong style="color: #000;">Price: $${product.price.toFixed(2)}</strong>
              <p style="color: #888;">Quantity: ${product.quantity}</p>
            </div>
          </div>
        `,
      )
      .join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        
        <h1 style="color: #333; text-align: center;">Thank You for Your Purchase!</h1>
        ${productItems}
        <p style="text-align: center; color: #888;">We hope you enjoy your products!</p>
      </div>
    `;
  }
}
