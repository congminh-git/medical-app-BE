import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Messages } from './messages.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, User])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
