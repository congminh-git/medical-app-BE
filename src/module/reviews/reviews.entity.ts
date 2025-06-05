import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('reviews')
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  patient_id: number;

  @Column({ type: 'int', nullable: true })
  doctor_id: number;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'doctor_id' }) // mapping doctor_id → user.id
  doctor: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patient_id' })
  patient: User;
}
