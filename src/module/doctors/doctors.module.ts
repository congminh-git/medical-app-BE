import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctors.entity';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsScheduler } from './doctors.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])], // Đăng ký repository
  providers: [DoctorsService, DoctorsScheduler],
  controllers: [DoctorsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class DoctorsModule {}
