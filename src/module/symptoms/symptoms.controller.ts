import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import type { Symptom } from './symptoms.entity';

@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Post()
  create(@Body() createDto: any): Promise<Symptom> {
    return this.symptomsService.create(createDto);
  }

  @Get()
  async findAll(): Promise<Array<Symptom>> {
    const symptoms = await this.symptomsService.findAll() as Array<Symptom>;
    return symptoms;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Symptom> {
    return this.symptomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any): Promise<Symptom> {
    return this.symptomsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.symptomsService.delete(+id);
  }
}
