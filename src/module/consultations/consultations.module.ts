import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctors/doctors.entity';
import { Consultation } from './consultations.entity';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { Prescription } from '../prescriptions/prescriptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, Doctor, Prescription])], // Đăng ký repository
  providers: [ConsultationsService],
  controllers: [ConsultationsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class ConsultationsModule {}
