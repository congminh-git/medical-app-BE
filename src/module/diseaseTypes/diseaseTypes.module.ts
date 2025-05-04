import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseType } from './diseaseTypes.entity';
import { DiseaseTypesService } from './diseaseTypes.service';
import { DiseaseTypesController } from './diseaseTypes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiseaseType])], // Đăng ký repository
  providers: [DiseaseTypesService],
  controllers: [DiseaseTypesController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class DiseaseTypesModule {}
