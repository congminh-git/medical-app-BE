import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reviews } from './reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private readonly revieewRepository: Repository<Reviews>,
  ) {}

  async create(createDto: any) {
    const newEntity = this.revieewRepository.create(createDto);
    return this.revieewRepository.save(newEntity);
  }

  async findAll(): Promise<Reviews[]> {
    return this.revieewRepository.find({
      order: {
        created_at: 'ASC', // Sắp xếp theo trường 'name' từ A đến Z
      },
    });
  }

  async findOne(id: number): Promise<Reviews> {
    const entity = await this.revieewRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<Reviews> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.revieewRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.revieewRepository.remove(entity);
  }

  async findByDoctorId(doctorId: number): Promise<any[]> {
    return this.revieewRepository
      .createQueryBuilder('review')
      .leftJoin('review.patient', 'patient')
      .addSelect(['patient.id', 'patient.full_name', 'patient.image']) // chỉ lấy 3 trường của patient
      .where('review.doctor_id = :doctorId', { doctorId })
      .orderBy('review.created_at', 'DESC')
      .getMany();
  }
}
