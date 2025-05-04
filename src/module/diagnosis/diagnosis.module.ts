import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './diagnosis.entity';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnosis])], // Đăng ký repository
  providers: [DiagnosisService],
  controllers: [DiagnosisController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class DiagnosisModule {}
