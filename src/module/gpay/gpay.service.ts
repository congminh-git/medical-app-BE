import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as CryptoJS from 'crypto-js'; // ✅ Sửa lại import đúng
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GpayService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async postCheckout(bodyData: any) {
    const url = 'https://uat-secure.galaxypay.vn/api/v1/transaction/checkout';

    const signature = CryptoJS.SHA256(
      JSON.stringify(bodyData) + 'YIDSN9ATEH',
    ).toString(CryptoJS.enc.Hex); // ✅ Bây giờ sẽ hoạt động đúng

    const headers = {
      accept: 'text/plain',
      apikey:
        'ICB7IjEiOiIxIiwiY3JlYXRlZCI6MjAyMjA4MTcxNjE0NTZ9.c4088df3ca18648ea0078dda0b879b32ba646730c2bf41b0255cc26d006f3e17',
      'content-type': 'application/json',
      signature: signature,
    };

    try {
      const response = await axios.post(url, bodyData, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to post checkout: ${error.message}`);
    }
  }

  async createPayment(content: any) {
    try {
      const payment = this.paymentRepository.create(content);
      return this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Không thể tạo thanh toán');
    }
  }

  async findAllUserPaymentTransactions(id: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: [
        { doctor_id: id },
        { user_id: id },
      ],
      relations: ['doctor'],
    });
  }  
}