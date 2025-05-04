import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiseaseType } from './diseaseTypes.entity';

@Injectable()
export class DiseaseTypesService {
  constructor(
    @InjectRepository(DiseaseType)
    private readonly diseaseTypeRepository: Repository<DiseaseType>,
  ) {}

  async create(createDto: any) {
    const newEntity = this.diseaseTypeRepository.create(createDto);
    return this.diseaseTypeRepository.save(newEntity);
  }

  async findAll(): Promise<DiseaseType[]> {
    return this.diseaseTypeRepository.find({
      order: {
        name: 'ASC',  // Sắp xếp theo trường 'name' từ A đến Z
      },
    });
  }

  async findOne(id: number): Promise<DiseaseType> {
    const entity = await this.diseaseTypeRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<DiseaseType> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.diseaseTypeRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.diseaseTypeRepository.remove(entity);
  }
}
