import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Patient } from '../patients/patients.entity';
import { Doctor } from '../doctors/doctors.entity';
import { User } from '../users/users.entity';
import { Consultation } from '../consultations/consultations.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  patient_id: number;
  
  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' }) // Liên kết với user_id của bảng User
  patient: User;
  
  @Column({ type: 'int' })
  doctor_id: number;
  
  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' }) // Liên kết với user_id của bảng User
  doctor: User;

  @Column({ type: 'int' })
  appointment_time: number;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  joined: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Consultation, (consultation) => consultation.appointment)
  consultations: Consultation[];
}
