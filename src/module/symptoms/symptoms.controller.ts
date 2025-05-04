import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { Symptom } from './symptoms.entity';

@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.symptomsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.symptomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.symptomsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.symptomsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.symptomsService.remove(+id);
  }
}
