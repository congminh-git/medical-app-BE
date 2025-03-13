import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './doctors.entity';

@Injectable()
export class DoctorsScheduler {
  private readonly logger = new Logger(DoctorsScheduler.name);

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  @Cron('0 0 25 * *') // Chạy vào 00:00 ngày 25 hàng tháng
  async handleAppointmentScheduleCleanup() {
    this.logger.log('Đang chạy cron job dọn dẹp và cập nhật lịch hẹn...');

    const doctors = await this.doctorRepository.find();

    const currentDate = new Date();
    const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const daysInNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();

    for (const doctor of doctors) {
      if (!doctor.appointment_schedule) {
        doctor.appointment_schedule = [];
      }

      // **1. Xóa lịch hẹn cũ**
      doctor.appointment_schedule = doctor.appointment_schedule.filter(
        (appt) => new Date(appt.date) >= twoMonthsAgo,
      );

      // **2. Thêm lịch hẹn mới**
      for (let day = 1; day <= daysInNextMonth; day++) {
        for (let index = 1; index <= 5; index++) {
          doctor.appointment_schedule.push({
            date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
            index,
          });
        }
      }

      // **Lưu cập nhật vào DB**
      await this.doctorRepository.save(doctor);
    }

    this.logger.log('Hoàn thành cập nhật lịch hẹn.');
  }
}
