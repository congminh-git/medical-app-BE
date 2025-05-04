import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  message: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'int'})
  sender_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ type: 'int'})
  receiver_id: number;

  @Column({ type: 'tinyint', default: 0 })
  readed: number;

  @Column({ type: 'timestamp'})
  created_at: Date;
}
