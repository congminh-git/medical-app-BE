import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseTypesService } from './diseaseTypes.service';
import { DiseaseTypesController } from './diseaseTypes.controller';
import { DiseaseType } from './diseaseTypes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiseaseType])],
  controllers: [DiseaseTypesController],
  providers: [DiseaseTypesService],
  exports: [DiseaseTypesService],
})
export class DiseaseTypesModule {}
