import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineType } from './medicineTypes.entity';
import { MedicineTypesService } from './medicineTypes.service';
import { MedicineTypesController } from './medicineTypes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicineType])], // Đăng ký repository
  providers: [MedicineTypesService],
  controllers: [MedicineTypesController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class MedicineTypesModule {}
