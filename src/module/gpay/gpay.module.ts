import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GpayController } from './gpay.controller';
import { GpayService } from './gpay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Payment])],
  controllers: [GpayController],
  providers: [GpayService],
})
export class GpayModule {}
