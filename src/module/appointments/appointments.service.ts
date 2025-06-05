import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { Appointment } from './appointments.entity';
import { Between } from 'typeorm';
import { startOfWeek, endOfWeek } from 'date-fns';
import { AppointmentStatus } from './appointments.entity';
import * as cron from 'node-cron';
import { Cron } from '@nestjs/schedule';
import { User, UserStatus } from '../users/users.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly emailService: MailService,
  ) {
    this.scheduleMeetingCheck();
    this.checkMeetingStatus();
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async findOne(id: number): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({ where: { id: id } });
  }

  async create(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(appointmentData);
    return await this.appointmentRepository.save(appointment);
  }

  async update(
    id: number,
    appointmentData: Partial<Appointment>,
  ): Promise<Appointment> {
    await this.appointmentRepository.update(id, appointmentData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.appointmentRepository.delete(id);
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.consultations', 'consultations')
      .select([
        'appointment', // Lấy tất cả các trường của appointment
        'doctor.full_name',
        'doctor.email',
        'doctor.phone_number',
        'patient.full_name',
        'patient.email',
        'patient.phone_number',
        'consultations.chief_complaint',
        'consultations.medical_history',
        'consultations.symptoms',
        'consultations.disease_types',
        'consultations.diagnosis',
        'consultations.differential_diagnosis',
        'consultations.treatment_plan',
        'consultations.follow_up_instructions',
        'consultations.recommendations',
        'consultations.notes',
        'consultations.created_at',
        'consultations.prescription_id',
      ])
      .where('appointment.doctor_id = :doctorId', { doctorId })
      .getMany();
  }

  async findByPatient(patientId: number): Promise<Appointment[]> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.consultations', 'consultations')
      .select([
        'appointment', // Lấy tất cả các trường của appointment
        'doctor.full_name',
        'doctor.email',
        'doctor.phone_number',
        'patient.full_name',
        'patient.email',
        'patient.phone_number',
        'consultations.chief_complaint',
        'consultations.medical_history',
        'consultations.symptoms',
        'consultations.disease_types',
        'consultations.diagnosis',
        'consultations.differential_diagnosis',
        'consultations.treatment_plan',
        'consultations.follow_up_instructions',
        'consultations.recommendations',
        'consultations.notes',
        'consultations.created_at',
        'consultations.prescription_id',
      ])
      .where('appointment.patient_id = :patientId', { patientId })
      .getMany();
  }

  async findNextAppointment(id: number): Promise<any> {
    // Find the appointment by id
    const appointment = await this.appointmentRepository.findOne({
      where: { id: id },
    });
    if (!appointment) {
      return null;
    }

    // Calculate the timestamp for 30 minutes after the found appointment
    const thirtyMinutesAfter = appointment.appointment_time + 30 * 60;

    // Find the next appointment with the same doctor_id and appointment_time 30 minutes after
    const nextAppointment = await this.appointmentRepository.findOne({
      where: {
        doctor_id: appointment.doctor_id,
        appointment_time: thirtyMinutesAfter,
      },
    });

    if (!nextAppointment) {
      return {
        message: 'Không có lịch hẹn kế tiếp',
      };
    } else {
      console.log('Gửi mail hỏi dời lịch');
    }

    return nextAppointment;
  }

  async findAppointmentsThisWeek(doctorId: number): Promise<Appointment[]> {
    const today = new Date();
    const startOfThisWeek = Math.floor(
      startOfWeek(today, { weekStartsOn: 1 }).getTime() / 1000,
    );
    const endOfThisWeek = Math.floor(
      endOfWeek(today, { weekStartsOn: 1 }).getTime() / 1000,
    );

    const appointments = await this.appointmentRepository.find({
      where: {
        doctor_id: doctorId,
        appointment_time: Raw(
          (alias) =>
            `${alias} >= ${startOfThisWeek} AND ${alias} <= ${endOfThisWeek}`,
        ),
      },
    });

    return appointments || [];
  }

  async updateConfirmed(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: id },
    });
    if (appointment.status == AppointmentStatus.PENDING) {
      appointment.status = AppointmentStatus.CONFIRMED;
      await this.appointmentRepository.save(appointment);
    } else if (appointment.status == AppointmentStatus.CONFIRMED) {
      appointment.status = AppointmentStatus.COMPLETED;
      await this.appointmentRepository.save(appointment);
    }
    return this.findOne(id);
  }

  @Cron('* * * * *')
  private async scheduleMeetingCheck() {
    // Lấy thời gian hiện tại theo UTC
    const nowUTC = new Date(Date.now());
    const nowVN = new Date(nowUTC.getTime());
    const now = Math.floor(nowVN.getTime() / 1000);
    const thirtyMinutesAfter = Math.floor(nowVN.getTime() / 1000 + 30 * 60);

    const appointments = await this.appointmentRepository.find({
      where: { appointment_time: now, status: AppointmentStatus.PENDING },
    });

    const appointmentsIn30Minutes = await this.appointmentRepository.find({
      where: {
        appointment_time: thirtyMinutesAfter,
        status: AppointmentStatus.PENDING,
      },
    });

    for (const appointment of appointments) {
      const meetingUrl = `https://meet.jit.si/medicalapp_${appointment.id}`;
      appointment.url = meetingUrl;
      await this.appointmentRepository.save(appointment);
    }

    for (const appointment of appointmentsIn30Minutes) {
      await this.emailService.sendConfirmationEmail(appointment.id);
    }
  }

  // Cron job kiểm tra meeting không có ai tham gia sau 2 giờ thì hủy
  @Cron('*/30 * * * *')
  // @Cron('* * * * *')
  private async checkMeetingStatus() {
    // Lấy thời gian hiện tại theo UTC
    const nowUTC = new Date();

    // Cộng thêm 7 giờ để chuyển sang giờ Việt Nam (UTC+7)
    const twoHoursAgoVN = new Date(nowUTC.getTime());

    // Trừ đi 2 giờ từ giờ Việt Nam
    twoHoursAgoVN.setMinutes(twoHoursAgoVN.getMinutes() - 30);

    // Chuyển giờ Việt Nam thành timestamp
    const timestamp = Math.floor(twoHoursAgoVN.getTime() / 1000);

    const expiredAppointments = await this.appointmentRepository.find({
      where: { appointment_time: timestamp, status: AppointmentStatus.PENDING },
    });

    for (const appointment of expiredAppointments) {
      appointment.status = AppointmentStatus.CANCELED;
      await this.appointmentRepository.save(appointment);

      // Find user by patient_id
      const user = await this.userRepository.findOne({
        where: { id: appointment.patient_id },
      });
      if (user) {
        // Update canceled appointments fields
        user.canceled_appointments += 1;
        user.canceled_appointments_consecutive += 1;
        await this.userRepository.save(user);

        // Check consecutive canceled appointments and send emails
        if (user.canceled_appointments_consecutive === 3) {
          await this.emailService.sendWarningEmail(user.email, user.full_name);
        } else if (user.canceled_appointments_consecutive === 5) {
          user.status = UserStatus.INACTIVE;
          await this.emailService.sendAccountBlockedEmail(
            user.email,
            user.full_name,
          );
        }
      }
    }
  }
}
