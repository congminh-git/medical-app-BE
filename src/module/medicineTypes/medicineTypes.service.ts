import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicineType } from './medicineTypes.entity';

@Injectable()
export class MedicineTypesService {
  constructor(
    @InjectRepository(MedicineType)
    private readonly medicineTypeRepository: Repository<MedicineType>,
  ) {}

  async create(createDto: any) {
    const newEntity = this.medicineTypeRepository.create(createDto);
    return this.medicineTypeRepository.save(newEntity);
  }

  async findAll(): Promise<MedicineType[]> {
    return this.medicineTypeRepository.find({
      order: {
        name: 'ASC',  // Sắp xếp theo trường 'name' từ A đến Z
      },
    });
  }

  async findOne(id: number): Promise<MedicineType> {
    const entity = await this.medicineTypeRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<MedicineType> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.medicineTypeRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.medicineTypeRepository.remove(entity);
  }
}
