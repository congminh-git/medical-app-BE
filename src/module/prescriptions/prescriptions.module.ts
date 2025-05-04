import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctors/doctors.entity';
import { Prescription } from './prescriptions.entity';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, Doctor])], // Đăng ký repository
  providers: [PrescriptionsService],
  controllers: [PrescriptionsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class PrescriptionsModule {}
