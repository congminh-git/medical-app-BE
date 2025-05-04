import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symptom } from './symptoms.entity';
import { SymptomsService } from './symptoms.service';
import { SymptomsController } from './symptoms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Symptom])], // Đăng ký repository
  providers: [SymptomsService],
  controllers: [SymptomsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class SymptomsModule {}
