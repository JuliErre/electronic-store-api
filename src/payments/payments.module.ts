import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { MercadopagoService } from './mercadopago/mercadopago.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MercadopagoService],
})
export class PaymentsModule {}
