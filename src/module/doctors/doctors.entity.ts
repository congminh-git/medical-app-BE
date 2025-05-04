import { Entity, PrimaryColumn, Column, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Specialty } from '../specialties/specialties.entity';
import { Appointment } from '../appointments/appointments.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true })
  license_number: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @ManyToOne(() => Specialty, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @Column({ type: 'int', nullable: true })
  specialty_id: number;

  @Column({ type: 'int', nullable: true })
  experience_years: number;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  workplace: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultation_fee: number;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;
}