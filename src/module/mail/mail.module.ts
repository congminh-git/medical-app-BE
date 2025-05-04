// src/module/mail/mail.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { Appointment } from '../appointments/appointments.entity';
import { User } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User]),
    AppointmentsModule,
    UsersModule,
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
