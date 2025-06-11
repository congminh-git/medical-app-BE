import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis } from './diagnosis.entity';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) {}

  async findAll(): Promise<Diagnosis[]> {
    return this.diagnosisRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Diagnosis> {
    const diagnosis = await this.diagnosisRepository.findOne({ where: { id } });
    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with id ${id} not found`);
    }
    return diagnosis;
  }

  async create(data: any): Promise<any> {
    const diagnosis = this.diagnosisRepository.create(data);
    return this.diagnosisRepository.save(diagnosis);
  }

  async update(id: number, data: any): Promise<Diagnosis> {
    const diagnosis = await this.findOne(id);
    Object.assign(diagnosis, data);
    return this.diagnosisRepository.save(diagnosis);
  }

  async remove(id: number): Promise<void> {
    const diagnosis = await this.findOne(id);
    await this.diagnosisRepository.remove(diagnosis);
  }
}
