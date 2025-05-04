import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './module/doctors/doctors.entity';
import { Patient } from './module/patients/patients.entity';
import { Specialty } from './module/specialties/specialties.entity';
import { Appointment } from './module/appointments/appointments.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getCounts(): Promise<any> {
    const doctorCount = await this.doctorRepository.count();
    const patientCount = await this.patientRepository.count();
    const specialtyCount = await this.specialtyRepository.count();
    const appointmentCount = await this.appointmentRepository.count();

    return {
      doctors: doctorCount,
      patients: patientCount,
      specialties: specialtyCount,
      appointments: appointmentCount,
    };
  }
}