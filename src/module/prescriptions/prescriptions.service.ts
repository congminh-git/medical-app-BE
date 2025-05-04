import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './prescriptions.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
  ) {}

  async create(createDto: any) {
    const newEntity = this.prescriptionRepository.create(createDto);
    return this.prescriptionRepository.save(newEntity);
  }

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionRepository.find();
  }

  async findOne(id: number): Promise<Prescription> {
    const entity = await this.prescriptionRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<Prescription> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.prescriptionRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.prescriptionRepository.remove(entity);
  }
}
