import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { Specialty } from './specialties.entity';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  findAll(): Promise<Specialty[]> {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Specialty> {
    return this.specialtiesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Specialty>): Promise<Specialty> {
    return this.specialtiesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Specialty>): Promise<Specialty> {
    return this.specialtiesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.specialtiesService.delete(id);
  }
}
