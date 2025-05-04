import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('medicine_type')
export class MedicineType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;
  
  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at: Date | null;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at: Date | null;
}
