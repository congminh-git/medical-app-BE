import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DiseaseTypesService } from './diseaseTypes.service';
import { DiseaseType } from './diseaseTypes.entity';

@Controller('diseaseTypes')
export class DiseaseTypesController {
  constructor(private readonly diseaseTypesService: DiseaseTypesService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.diseaseTypesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.diseaseTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diseaseTypesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.diseaseTypesService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diseaseTypesService.delete(+id);
  }
}
