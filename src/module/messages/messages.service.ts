import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './messages.entity';
import { User } from '../users/users.entity';

import { In } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private messageRepository: Repository<Messages>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Tạo tin nhắn mới
  async createMessages(
    senderId: number,
    receiverId: number,
    content: string,
  ): Promise<Messages> {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = this.messageRepository.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message: content,
    });

    return this.messageRepository.save(message);
  }

  // Lấy tất cả tin nhắn giữa hai người dùng
  async getMessagesBetweenUsers(
    userId1: number,
    userId2: number,
  ): Promise<Messages[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      order: { created_at: 'ASC' },
    });
  } // nhớ import thêm

  async markAsRead(listID: number[]): Promise<void> {
    const messages = await this.messageRepository.find({
      where: { id: In(listID) },
    });

    messages.forEach((msg) => {
      msg.readed = 1;
    });

    if (messages.length > 0) {
      await this.messageRepository.save(messages);
    }
  }

  async getLatestMessages(
    userId1: number,
    userId2: number,
  ): Promise<Messages[]> {
    const messages = await this.messageRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      order: { created_at: 'DESC' },
      take: 5,
      relations: ['sender', 'receiver'],
    });

    // Cập nhật các tin nhắn gửi đến userId1 mà chưa đọc
    const unreadMessages = messages.filter(
      (msg) => msg.receiver_id == userId1 && msg.readed == 0,
    );

    if (unreadMessages.length > 0) {
      for (const msg of unreadMessages) {
        msg.readed = 1;
      }
      await this.messageRepository.save(unreadMessages);
    }

    return messages;
  }

  async getAllMessagesContact(userId: number): Promise<User[]> {
    const sentMessages = await this.messageRepository.find({
      where: { sender_id: userId },
    });

    const receivedMessages = await this.messageRepository.find({
      where: { receiver_id: userId },
    });

    const contactIds = new Set<number>();
    sentMessages.forEach((msg) => contactIds.add(msg.receiver_id));
    receivedMessages.forEach((msg) => contactIds.add(msg.sender_id));

    if (contactIds.size === 0) return [];

    const users = await this.userRepository.find({
      where: { id: In([...contactIds]) },
    });

    return users;
  }

  async getAllUnreadMessages(userId: number): Promise<Messages[]> {
    // Lấy tin nhắn gửi đi và nhận vào
    const sentMessages = await this.messageRepository.find({
      where: { receiver_id: userId, readed: 0 },
    });
    return sentMessages;
  }
}
