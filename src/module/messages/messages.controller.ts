import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './messages.entity';
import { User } from '../users/users.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  // API tạo tin nhắn mới
  @Post('send')
  async createMessages(
    @Body() { senderId, receiverId, content }: { senderId: number, receiverId: number, content: string }
  ): Promise<Messages> {
    return this.messageService.createMessages(senderId, receiverId, content);
  }

  @Get('contact/:id')
  async getAllMessagesContact(
    @Param('id') id: number
  ): Promise<User[]> {
    return this.messageService.getAllMessagesContact(id);
  }

  @Get('unread/:id')
  async getAllUnreadMessages(
    @Param('id') id: number
  ): Promise<Messages[]> {
    return this.messageService.getAllUnreadMessages(id);
  }

  // API lấy tin nhắn giữa 2 người dùng
  @Get(':userId1/:userId2')
  async getMessagesBetweenUsers(
    @Param('userId1') userId1: number,
    @Param('userId2') userId2: number
  ): Promise<Messages[]> {
    return this.messageService.getMessagesBetweenUsers(userId1, userId2);
  }

  @Get(':userId1/:userId2/lastest')
  async getLastestMessagessBetweenUsers(
    @Param('userId1') userId1: number,
    @Param('userId2') userId2: number
  ): Promise<Messages[]> {
    return this.messageService.getLatestMessages(userId1, userId2);
  }

  // API đánh dấu tin nhắn là đã đọc
  @Put('read')
  async markAsRead(@Body() body: {listID: number[]}): Promise<void> {
    return this.messageService.markAsRead(body.listID);
  }
}
