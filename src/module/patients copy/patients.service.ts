import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async findOne(id: number): Promise<Patient | null> {
    return await this.patientRepository.findOne({ where: { user_id: id } });
  }

  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(patientData);
    return await this.patientRepository.save(patient);
  }

  async update(id: number, patientData: Partial<Patient>): Promise<Patient> {
    await this.patientRepository.update(id, patientData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
