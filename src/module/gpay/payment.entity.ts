import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
  } from 'typeorm';
import { User } from '../users/users.entity';
  
  @Entity('payments')
  export class Payment {
    @PrimaryColumn({ name: 'trans_id', type: 'varchar', length: 255 })
    trans_id: string;
  
    @Column({ name: 'order_id', type: 'varchar', length: 255 })
    order_id: string;
  
    @Column({ name: 'request_id', type: 'varchar', length: 255 })
    request_id: string;
  
    @Column({ name: 'user_id', type: 'int', nullable: true })
    user_id: number;
  
    @Column({ name: 'doctor_id', type: 'int', nullable: true })
    doctor_id: number;
      
    @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' }) 
    doctor: User;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;
  
    @Column({ type: 'varchar', length: 255 })
    method: string;
  
    @Column({
      type: 'enum',
      enum: ['success', 'failed'],
    })
    status: 'success' | 'failed';

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  }
  