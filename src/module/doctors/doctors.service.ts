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

  async findAll(): Promise<any[]> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor',
        'user.full_name',
        'user.email',
        'user.phone_number',
        'user.image',
      ])
      .getMany();
  }

  async findOne(id: number): Promise<any | null> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor',
        'user.full_name',
        'user.email',
        'user.phone_number',
        'user.image',
      ])
      .where('doctor.user_id = :id', { id })
      .getOne();
  }

  async findTopNew(): Promise<any[]> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor',
        'user.full_name',
        'user.email',
        'user.phone_number',
        'user.created_at',
        'user.image',
      ])
      .orderBy('user.created_at', 'DESC')
      .limit(10)
      .getMany();
  }

  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return await this.doctorRepository.save(doctor);
  }

  async update(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
    await this.doctorRepository
      .createQueryBuilder()
      .update(Doctor)
      .set(doctorData)
      .where('user_id = :id', { id })
      .execute();
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }
}
