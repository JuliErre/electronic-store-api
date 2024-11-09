import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { Model } from 'mongoose';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { EmailService } from 'src/services/email/email.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MercadopagoService } from './mercadopago/mercadopago.service';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly mercadopagoService: MercadopagoService,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly emailService: EmailService,
  ) {}
  async create(createLinkDto: CreateLinkDto) {
    try {
      // const items: Items[] = [
      //   {
      //     id: '1234',
      //     title: 'Test',
      //     unit_price: 50,
      //     quantity: 2,
      //   },
      //   {
      //     id: '1235',
      //     title: 'Test 2',
      //     unit_price: 10,
      //     quantity: 1,
      //   },
      // ];
      const items: Items[] = createLinkDto.items.map((item) => ({
        id: item.id,
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
        picture_url: item.imageUrl,
      }));

      const mercadopagoLink =
        await this.mercadopagoService.createMercadopagoLink(
          items,
          createLinkDto.userId,
          createLinkDto.email,
        );
      return mercadopagoLink;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      console.log(createPaymentDto);
      const payment = await this.mercadopagoService.createMercadopagoPayment(
        createPaymentDto.data.id,
      );

      if (payment.status === 'approved') {
        const products: Items[] = payment.metadata.items;
        products.forEach(async (item) => {
          await this.productsService.updateProductStock(item.id, item.quantity);
        });

        await this.ordersService.create({
          email: payment.metadata.email!,
          userId: payment.metadata.user_id!,
          products: products,
          paymentId: payment.id,
          total: payment.transaction_amount,
        });

        const email = payment.metadata.email!;
        const productsData = products.map((product) => ({
          name: product.title,
          description: product.description,
          price: product.unit_price,
          imageUrl: product.picture_url,
          quantity: product.quantity,
        }));
        this.emailService.sendProductPurchaseEmail(email, productsData);
      }
      const paymentData = {
        paymentId: payment.id,
        status: payment.status,
        text: payment.metadata.text,
        amount: payment.transaction_amount,
        detail: payment.description,
      };
      await this.paymentModel.create(paymentData);

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment ${updatePaymentDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
