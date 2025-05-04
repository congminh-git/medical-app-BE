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

  @Post()
  create(@Body() createDto: any) {
    return this.diagnosisService.create(createDto);
  }

  @Get()
  findAll() {
    return this.diagnosisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosisService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.diagnosisService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosisService.remove(+id);
  }
}
