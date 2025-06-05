import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from '../appointments/appointments.entity';

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', nullable: true })
  appointment_id: number | null;

  @ManyToOne(() => Appointment, (appointment) => appointment.consultations, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointment_id', referencedColumnName: 'id' })
  appointment: Appointment;

  @Index()
  @Column({ type: 'int', nullable: true })
  prescription_id: number | null;

  @Column({ type: 'varchar', length: 50 })
  doctor_id: string;

  @Column({ type: 'varchar', length: 50 })
  patient_id: string;

  @Column({ type: 'text' })
  chief_complaint: string;

  @Column({ type: 'text', nullable: true })
  medical_history: string | null;

  @Column({ type: 'text' })
  symptoms: string;

  @Column({ type: 'text' })
  disease_types: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  differential_diagnosis: string | null;

  @Column({ type: 'text' })
  treatment_plan: string;

  @Column({ type: 'text', nullable: true })
  follow_up_instructions: string | null;

  @Column({ type: 'text', nullable: true })
  recommendations: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at: Date | null;
}
