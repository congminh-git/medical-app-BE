import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './consultations.entity';
import { Prescription } from '../prescriptions/prescriptions.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
  ) {}

  async create(createDto: any) {
    const consultations = createDto.consultations
    const prescriptions = createDto.prescriptions

    const newPrescription = await this.prescriptionRepository.create({
      patient_id: consultations.patient_id,
      doctor_id: consultations.doctor_id,
      prescription_info: JSON.stringify(prescriptions)
    })
    this.prescriptionRepository.save(newPrescription)

    const newConsultationsInfo = {
      ...consultations,
     prescription_id: newPrescription.id
    }

    const newConsultation = this.consultationRepository.create(newConsultationsInfo);
    return this.consultationRepository.save(newConsultation);
  }

  async findAll(): Promise<Consultation[]> {
    return this.consultationRepository.find();
  }

  async findOne(id: number): Promise<Consultation> {
    const entity = await this.consultationRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: any): Promise<Consultation> {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, updateDto);
    return this.consultationRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.consultationRepository.remove(entity);
  }
}
