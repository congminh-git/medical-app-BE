import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../appointments/appointments.entity';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  MANAGE = 'manage',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column({type: 'longtext', nullable: true})
  image: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;

  @Column({ type: 'int', default: 0 })
  canceled_appointments: number;

  @Column({ type: 'int', default: 0 })
  canceled_appointments_consecutive: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
