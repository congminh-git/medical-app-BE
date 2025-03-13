import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';
import { Doctor } from '../doctors/doctors.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findOne(id: number): Promise<Patient | null> {
    return await this.patientRepository.findOne({ where: { user_id: id } });
  }

  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(patientData);
    return await this.patientRepository.save(patient);
  }

  async update(id: number, patientData: Partial<Patient>): Promise<Patient> {
    await this.patientRepository.update(id, patientData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }

  async addAppointment(
    patientId: number,
    appointmentData: { doctorId: number; date: string; index: number; status: string }
  ): Promise<Patient | null> {
    const patient = await this.findOne(patientId);
    if (!patient) return null;
  
    // Tạo ID theo quy tắc
    const appointmentId = `u${appointmentData.doctorId}${appointmentData.date.replace(/-/g, '')}${appointmentData.index}`;
  
    // Thêm dữ liệu vào mảng appointment
    const newAppointment = { id: appointmentId, ...appointmentData };
    patient.appointment = Array.isArray(patient.appointment) ? [...patient.appointment, newAppointment] : [newAppointment];
  
    await this.patientRepository.save(patient);
  
    // Cập nhật lịch hẹn của bác sĩ
    await this.updateDoctorSchedule(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.index,
      patientId,
      appointmentData.status
    );
  
    return patient;
  }
  
  async updateAppointment(
    patientId: number,
    appointmentId: string,
    updateData: Partial<{ doctorId: number; date: string; index: number; status: string }>
  ): Promise<Patient | null> {
    const patient = await this.findOne(patientId);
    if (!patient) return null;

    if (!Array.isArray(patient.appointment)) return null;

    // Tìm appointment cần cập nhật
    const appointmentIndex = patient.appointment.findIndex(app => app.id === appointmentId);
    if (appointmentIndex === -1) return null;

    // Cập nhật dữ liệu appointment của bệnh nhân
    patient.appointment[appointmentIndex] = { ...patient.appointment[appointmentIndex], ...updateData };
    await this.patientRepository.save(patient);

    // Nếu có doctorId, cập nhật lịch hẹn của bác sĩ
    if (updateData.doctorId && updateData.date !== undefined && updateData.index !== undefined) {
      await this.updateDoctorSchedule(updateData.doctorId, updateData.date, updateData.index, patientId, updateData.status);
    }

    return patient;
  }

  private async updateDoctorSchedule(
    doctorId: number,
    date: string,
    index: number,
    patientId: number,
    status?: string
  ): Promise<void> {
    const doctor = await this.doctorRepository.findOne({ where: { user_id: doctorId } });
    if (!doctor) return;

    // Đảm bảo appointment_schedule là một mảng hợp lệ
    const schedule = Array.isArray(doctor.appointment_schedule) ? doctor.appointment_schedule : [];

    // Tìm lịch hẹn có cùng `index` và `date`
    const scheduleIndex = schedule.findIndex(s => s.index === index && s.date === date);

    if (scheduleIndex !== -1) {
      // Cập nhật status và patientId nếu lịch hẹn tồn tại
      schedule[scheduleIndex] = { ...schedule[scheduleIndex], status, patientId };
    } else {
      // Nếu chưa có lịch hẹn, tạo mới
      schedule.push({ index, date, patientId, status });
    }

    // Lưu lại lịch hẹn vào bảng doctors
    doctor.appointment_schedule = schedule;
    await this.doctorRepository.save(doctor);
  }
}
