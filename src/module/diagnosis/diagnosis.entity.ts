import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('diagnosis')
export class Diagnosis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at: Date | null;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at: Date | null;
}
