import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { Doctor } from './doctors.entity';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get('doctor/:id')
  async findOne(@Param('id') id: number): Promise<Doctor | null> {
    return this.doctorsService.findOne(id);
  }

  @Get('top-new')
  async findTopNew(
    @Query('recommendation') recommendation: string,
  ): Promise<Doctor[]> {
    return this.doctorsService.findTopNew(recommendation);
  }

  @Post()
  async create(@Body() doctorData: Partial<Doctor>): Promise<Doctor> {
    return this.doctorsService.create(doctorData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() doctorData: Partial<Doctor>): Promise<Doctor> {
    return this.doctorsService.update(id, doctorData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.doctorsService.delete(id);
  }
}
