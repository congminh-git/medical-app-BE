import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  user_id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' }) // Khi user bị xóa, patient cũng sẽ bị xóa
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'text', nullable: true })
  medical_history: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ length: 255, unique: true })
  blood_type: string;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'json', nullable: true })
  appointment: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  descriptions: string;
}
