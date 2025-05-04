import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './specialties.entity';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty])],
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
  exports: [TypeOrmModule],
})
export class SpecialtiesModule {}
