import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctors.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findOne(id: number): Promise<Doctor | null> {
    return await this.doctorRepository.findOne({ where: { user_id: id } });
  }

  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return await this.doctorRepository.save(doctor);
  }

  async update(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
    await this.doctorRepository.update(id, doctorData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }
}
