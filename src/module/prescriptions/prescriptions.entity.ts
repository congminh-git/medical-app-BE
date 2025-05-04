import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  patient_id: number;

  @Column({ type: 'int', nullable: true })
  doctor_id: number;

  @Column({ type: 'text', nullable: false })
  prescription_info: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
