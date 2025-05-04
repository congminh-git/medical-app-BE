import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis } from './diagnosis.entity';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(Diagnosis)
    private readonly diagnosisRepository: Repository<Diagnosis>,
  ) {}

  async create(createDto: any) {
    const newEntity = this.diagnosisRepository.create(createDto);
    return this.diagnosisRepository.save(newEntity);
  }

  async findAll(): Promise<Diagnosis[]> {
    return this.diagnosisRepository.find({
      order: {
        name: 'ASC',  // Sắp xếp theo trường 'name' từ A đến Z
      },
    });
  }

  async findOne(id: number): Promise<Diagnosis> {
    const entity = await this.diagnosisRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<Diagnosis> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.diagnosisRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.diagnosisRepository.remove(entity);
  }
}
