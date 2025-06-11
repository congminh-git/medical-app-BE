import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { Diagnosis } from './diagnosis.entity';

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Get()
  findAll(): Promise<Diagnosis[]> {
    return this.diagnosisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Diagnosis> {
    return this.diagnosisService.findOne(+id);
  }

  @Post()
  create(@Body() data: any): Promise<Diagnosis> {
    return this.diagnosisService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any): Promise<Diagnosis> {
    return this.diagnosisService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.diagnosisService.remove(+id);
  }
}
