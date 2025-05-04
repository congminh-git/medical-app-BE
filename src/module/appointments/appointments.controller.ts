import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointments.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('/appointment/:id')
  async findOne(@Param('id') id: number): Promise<Appointment | null> {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  async create(@Body() appointmentData: Partial<Appointment>): Promise<Appointment> {
    return this.appointmentsService.create(appointmentData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() appointmentData: Partial<Appointment>,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, appointmentData);
  }

  @Put(':id/confirmed')
  async updateConfirmed(
    @Param('id') id: number
  ): Promise<Appointment> {
    return this.appointmentsService.updateConfirmed(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.appointmentsService.delete(id);
  }

  @Get('/doctor/:doctor_id')
  async findByDoctor(@Param('doctor_id') doctorId: number): Promise<Appointment[]> {
      return this.appointmentsService.findByDoctor(doctorId);
  }

  @Get('/patient/:patient_id')
  async findByPatient(@Param('patient_id') patientId: number): Promise<Appointment[]> {
      return this.appointmentsService.findByPatient(patientId);
  }

  @Get('/doctor/:doctorId/this-week')
  async getAppointmentsThisWeek(@Param('doctorId') doctorId: number) {
    return await this.appointmentsService.findAppointmentsThisWeek(doctorId);
  }
}
