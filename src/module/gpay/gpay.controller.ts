import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param
} from '@nestjs/common';
import { GpayService } from './gpay.service';
import { Payment } from './payment.entity';

@Controller('gpay')
export class GpayController {
  constructor(private readonly gpayService: GpayService) {}

  @Get('/all')
  findAll(): Promise<Payment[]> {
    return this.gpayService.findAll();
  }
  
  @Post('checkout')
  async postCheckout(@Body() body) {
    try {
      const bodyData = body;
      const result = await this.gpayService.postCheckout(bodyData);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Post('payment')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() body) {
    try {
      console.log(body)
      return this.gpayService.createPayment(body);
    } catch (error) {
      return error;
    }
  }

  @Get('/all/:id')
  findAllUserPaymentTransactions(@Param('id') id: number): Promise<Payment[]> {
    return this.gpayService.findAllUserPaymentTransactions(id);
  }
}
