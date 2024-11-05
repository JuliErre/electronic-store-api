import { Injectable } from '@nestjs/common';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { Items } from 'mercadopago/dist/clients/commonTypes';

@Injectable()
export class MercadopagoService {
  private mercadopago: MercadoPagoConfig;

  constructor() {
    this.mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async createMercadopagoLink(items: Items[], userId: string, email: string) {
    try {
      const preference = await new Preference(this.mercadopago).create({
        body: {
          items,
          metadata: {
            text: 'Electronic Store',
            user_id: userId,
            email: email,
            items: items,
          },
          back_urls: {
            success: 'http://localhost:3000/',
            failure: 'http://localhost:3000/failure',
            pending: 'http://localhost:3000/pending',
          },
          auto_return: 'approved',
          payer: {
            email,
          },
        },
      });
      return {
        id: preference.id,
        link: preference.init_point,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async createMercadopagoPayment(paymentId: string) {
    try {
      const payment = await new Payment(this.mercadopago).get({
        id: paymentId,
      });
      return payment;
    } catch (error) {
      throw new Error(error);
    }
  }
}
