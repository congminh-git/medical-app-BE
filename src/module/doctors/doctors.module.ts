import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctors.entity';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])], // Đăng ký repository
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class DoctorsModule {}
