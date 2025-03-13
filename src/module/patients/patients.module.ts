import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patients.entity';
import { Doctor } from '../doctors/doctors.entity';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor])], // Đăng ký repository
  providers: [PatientsService],
  controllers: [PatientsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class PatientsModule {}
