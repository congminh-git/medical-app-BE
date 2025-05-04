import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';
import { Doctor } from '../doctors/doctors.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findOne(id: number): Promise<Patient | null> {
    return await this.patientRepository.findOne({ where: { user_id: id } });
  }

  async getAll(): Promise<Patient[]> {
    return await this.patientRepository.find();
  }

  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(patientData);
    return await this.patientRepository.save(patient);
  }

  async update(id: number, patientData: Partial<Patient>): Promise<Patient> {
    await this.patientRepository
    .createQueryBuilder()
    .update(Patient)
    .set(patientData)
    .where('user_id = :id', { id })
    .execute();
  return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
