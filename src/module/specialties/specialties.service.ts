import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from './specialties.entity';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtiesRepository: Repository<Specialty>,
  ) {}

  async findAll(): Promise<Specialty[]> {
    return this.specialtiesRepository.find({ relations: ['doctors'] });
  }

  async findOne(id: number): Promise<Specialty> {
    const specialty = await this.specialtiesRepository.findOne({
      where: { id },
      relations: ['doctors'],
    });
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }
    return specialty;
  }

  async create(data: Partial<Specialty>): Promise<Specialty> {
    const specialty = this.specialtiesRepository.create(data);
    return this.specialtiesRepository.save(specialty);
  }

  async update(id: number, data: Partial<Specialty>): Promise<Specialty> {
    await this.specialtiesRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.specialtiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }
  }
}
