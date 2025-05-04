import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctors/doctors.entity';
import { Appointment } from './appointments.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from '../users/users.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, User]),
            ScheduleModule.forRoot(),], 
  providers: [AppointmentsService, MailService],
  controllers: [AppointmentsController],
  exports: [TypeOrmModule, MailService, AppointmentsService], 
})
export class AppointmentsModule {}