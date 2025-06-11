import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Symptom } from './symptoms.entity';

@Injectable()
export class SymptomsService {
  constructor(
    @InjectRepository(Symptom)
    private readonly symptomRepository: Repository<Symptom>,
  ) {}

  async create(createDto: any): Promise<any> {
    const newEntity = this.symptomRepository.create(createDto);
    return this.symptomRepository.save(newEntity);
  }

  async findAll(): Promise<Array<Symptom>> {
    const symptoms = await this.symptomRepository.find({
      order: {
        name: 'ASC',  // Sắp xếp theo trường 'name' từ A đến Z
      },
    }) as Array<Symptom>;
    return symptoms;
  }

  async findOne(id: number): Promise<Symptom> {
    const entity = await this.symptomRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<Symptom> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.symptomRepository.save(updated);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.symptomRepository.remove(entity);
  }
}
