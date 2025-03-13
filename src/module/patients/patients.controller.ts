import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './patients.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Patient | null> {
    return this.patientsService.findOne(id);
  }

  @Post()
  async create(@Body() patientData: Partial<Patient>): Promise<Patient> {
    return this.patientsService.create(patientData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() patientData: Partial<Patient>): Promise<Patient> {
    return this.patientsService.update(id, patientData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.patientsService.delete(id);
  }

  

  @Post('/:id/appointment')
  async addAppointment(@Param('id') id: number, @Body() appointmentData: { doctorId: number; date: string; index: number; status: string }): Promise<Patient> {
    return this.patientsService.addAppointment(id, appointmentData);
  }

  @Put('/:id/appointment/:appointmentId')
  async updateAppointment(@Param('id') id: number, @Param('appointmentId') appointmentId: string, @Body() updateData: { doctorId: number; date: string; index: number; status: string }): Promise<Patient> {
    return this.patientsService.updateAppointment(id, appointmentId, updateData);
  }
}
