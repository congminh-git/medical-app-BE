import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Appointment } from '../appointments/appointments.entity';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { AppointmentsService } from '../appointments/appointments.service';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'congminh0801@gmail.com',
      pass: 'emavyqhtbkgwdfeo',
    },
  });

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendEmail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: '"Hệ thống Healthcare" <congminh0801@gmail.com>',
      to,
      subject,
      html,
    });
  }

  async getAppointment(appointmentID: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id: appointmentID } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async getUser(userID: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userID } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async sendWarningEmail(to: string, name: string) {
    const subject = 'Thông báo: Bạn đã bỏ lỡ 3 buổi tư vấn sức khỏe';
    const html = `
      <p>Chào ${name},</p>
  
      <p>Chúng tôi rất tiếc khi nhận thấy bạn đã không tham gia 3 buổi tư vấn sức khỏe gần đây do hệ thống sắp xếp. Chúng tôi hiểu rằng lịch trình cá nhân đôi khi có thể thay đổi và gây ảnh hưởng đến việc tham gia.</p>
  
      <p>Tuy nhiên, việc tham gia đầy đủ các buổi tư vấn là rất quan trọng để đảm bảo bạn nhận được sự hỗ trợ kịp thời, chính xác và toàn diện từ đội ngũ chuyên gia y tế của chúng tôi.</p>
  
      <p><strong>Lưu ý:</strong> Nếu tình trạng vắng mặt tiếp tục diễn ra, hệ thống buộc lòng sẽ tạm khóa tài khoản của bạn để đảm bảo chất lượng dịch vụ cho tất cả người dùng.</p>
  
      <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc sắp xếp lại lịch tư vấn phù hợp. Nếu bạn cần hỗ trợ, vui lòng liên hệ bộ phận chăm sóc khách hàng.</p>
  
      <p>Trân trọng,<br>
      Đội ngũ Chăm sóc Sức khỏe<br>
      Hệ thống Healthcare</p>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendAccountBlockedEmail(to: string, name: string) {
    const subject = 'Thông báo: Tài khoản của bạn đã bị tạm khóa';
    const html = `
      <p>Chào ${name},</p>
  
      <p>Hệ thống của chúng tôi vừa tiến hành <strong>tạm khóa tài khoản</strong> của bạn do ghi nhận các hành vi không phù hợp với quy định sử dụng dịch vụ chăm sóc sức khỏe trực tuyến.</p>
  
      <p>Quyết định này được đưa ra nhằm đảm bảo an toàn, minh bạch và hiệu quả trong quá trình hỗ trợ các khách hàng khác.</p>
  
      <p>Nếu bạn cho rằng đây là sự hiểu lầm hoặc cần được hỗ trợ thêm thông tin, xin vui lòng liên hệ bộ phận hỗ trợ khách hàng của chúng tôi qua:</p>
      <ul>
        <li>Email: support@yourhealthcare.com</li>
        <li>Hotline: 1900 123 456</li>
      </ul>
  
      <p>Chúng tôi luôn mong muốn đồng hành cùng bạn trên hành trình chăm sóc sức khỏe, và hy vọng có thể sớm khôi phục quyền truy cập khi mọi vấn đề được giải quyết rõ ràng.</p>
  
      <p>Trân trọng,<br>
      Đội ngũ Quản trị Hệ thống<br>
      Hệ thống Healthcare</p>
    `;

    return this.sendEmail(to, subject, html);
  }

  async sendConfirmationEmail(appointmentID: number) {
    const appointment = await this.getAppointment(appointmentID);
    const user = await this.getUser(appointment.patient_id);
  
    const to = user.email;
    const name = user.full_name;
  
    // Convert appointment_time to Vietnam time format using Intl.DateTimeFormat
    const appointmentTime = new Date(appointment.appointment_time * 1000);
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = formatter.format(appointmentTime);
  
    const subject = 'Xác nhận tham gia lịch tư vấn';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Chào ${name},</p>
        <p>Bạn đã được đăng ký lịch tư vấn với chúng tôi vào lúc ${formattedTime} sắp diễn ra.</p>
        <p>Chúng tôi cần xác nhận rằng bạn có thể tham gia lịch tư vấn đúng hẹn hay không để tối ưu lịch trình tư vấn cho bạn và các bệnh nhân khác.</p>
        <p>Vui lòng chọn một trong hai lựa chọn dưới đây:</p>
        <div style="margin: 20px 0;">
          <a href="http://localhost:3001/mail/confirm?appointmentID=${appointmentID}&response=yes" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin-right: 10px;">Có</a>
          <a href="http://localhost:3001/mail/confirm?appointmentID=${appointmentID}&response=no" style="background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Không</a>
        </div>
        <p>Trân trọng,<br>Đội ngũ Chăm sóc Sức khỏe<br>Hệ thống Healthcare</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendRescheduleEmail(id: number, nextAppointmentID: number) {
    const appointment = await this.getAppointment(nextAppointmentID);
    const user = await this.getUser(appointment.patient_id);
  
    const to = user.email;
    const name = user.full_name;
  
    // Convert appointment_time to Vietnam time format using Intl.DateTimeFormat
    const appointmentTime = new Date(appointment.appointment_time * 1000);
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = formatter.format(appointmentTime);
  
    const subject = 'Lời hỏi thăm về đổi lịch tư vấn';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Chào ${name},</p>
        <p>Bạn đã được đăng ký lịch tư vấn với chúng tôi vào lúc ${formattedTime} sắp diễn ra.</p>
        <p>Tuy nhiên lịch hẹn tư vấn ngay trước bạn đang gặp vấn đề và có mong muốn được đổi lịch với bạn. Hy vọng nếu có thể bạn sẽ hỗ trợ dời lịch hẹn của mình lên sớm để vừa giúp đỡ cho bác sĩ vừa giúp đỡ cho bệnh nhân khác. Bạn có muốn đổi lịch tư vấn của mình lên sớm 30ph hay không?.</p>
        <p>Vui lòng chọn một trong hai lựa chọn dưới đây:</p>
        <div style="margin: 20px 0;">
          <a href="http://localhost:3001/mail/reSchedule-confirm?appointmentID=${nextAppointmentID}&beforeAppointment=${id}&response=yes" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin-right: 10px;">Có</a>
          <a href="http://localhost:3001/mail/reSchedule-confirm?appointmentID=${nextAppointmentID}&beforeAppointment=${id}&response=no" style="background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Không</a>
        </div>
        <p>Cảm ơn đã hỗ trợ chúng tôi</p>
        <p>Trân trọng,<br>Đội ngũ Chăm sóc Sức khỏe<br>Hệ thống Healthcare</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async confirmAppointment(appointmentID: number, response: string): Promise<void> {
    if (response == 'yes') {
      console.log('Confirm yes')
    } else {
      await this.findNextAppointment(appointmentID)
    }
  }

  async confirmReSchedule(appointmentID: number, beforeAppointmentID: number, response: string): Promise<void> {
    if (response == 'yes') {
      const appointment = await this.getAppointment(appointmentID);
      const beforeAppointment = await this.getAppointment(beforeAppointmentID);

      if (appointment && beforeAppointment) {
        // Swap appointment_time
        const tempTime = appointment.appointment_time;
        appointment.appointment_time = beforeAppointment.appointment_time;
        beforeAppointment.appointment_time = tempTime;

        // Save the updated appointments
        await this.appointmentRepository.save(appointment);
        await this.appointmentRepository.save(beforeAppointment);

        await this.sendRescheduleSuccessEmailSchedule1(beforeAppointmentID)
        await this.sendRescheduleSuccessEmailSchedule2(appointmentID)
      } else {
        console.log('One or both appointments not found');
      }
    } else {
      console.log('Confirm no')
    }
  }

  async findNextAppointment(id: number): Promise<any> {
    const appointment = await this.appointmentRepository.findOne({ where: { id: id } });
    if (!appointment) {
      return null;
    }
    const thirtyMinutesAfter = appointment.appointment_time + 30 * 60;
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
      await this.sendRescheduleEmail(id, nextAppointment.id)
    }
    return nextAppointment;
  }

  async sendRescheduleSuccessEmailSchedule1(id:number) {
    const appointment = await this.getAppointment(id);
    const user = await this.getUser(appointment.patient_id);
  
    const to = user.email;
    const name = user.full_name;
  
    // Convert appointment_time to Vietnam time format using Intl.DateTimeFormat
    const appointmentTime = new Date(appointment.appointment_time * 1000);
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = formatter.format(appointmentTime);
  
    const subject = 'Thông báo dời lịch hẹn thành công';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Chào ${name},</p>
        <p>Bạn đã xác nhận không thể tham gia lịch hẹn gần nhất, tuy nhiên chúng tôi đã cố gắng hỗ trợ và xử lý dời lịch của bạn 30ph để bạn có cơ hội chuẩn bị thời gian</p>
        <p>Lịch hẹn mới sẽ là ${formattedTime}</p>
        <p>Hãy cố gắng sắp xếp thời gian để tham dự</p>
        <p>Trân trọng,<br>Đội ngũ Chăm sóc Sức khỏe<br>Hệ thống Healthcare</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendRescheduleSuccessEmailSchedule2(id:number) {
    const appointment = await this.getAppointment(id);
    const user = await this.getUser(appointment.patient_id);
  
    const to = user.email;
    const name = user.full_name;
  
    // Convert appointment_time to Vietnam time format using Intl.DateTimeFormat
    const appointmentTime = new Date(appointment.appointment_time * 1000);
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = formatter.format(appointmentTime);
  
    const subject = 'Thông báo dời lịch hẹn thành công';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Chào ${name},</p>
        <p>Cảm ơn bạn vì đã hỗ trợ chúng tôi để giúp đỡ bác sĩ và các bệnh nhân khác trong việc tham gia tư vấn trực tuyến đúng lịch, chúng tôi đã đẩy lịch hẹn của bạn lên sớm 30ph như bạn đã xác nhận</p>
        <p>Lịch hẹn mới sẽ là ${formattedTime}</p>
        <p>Vô cùng biết hơn bạn vì sự giúp đỡ này</p>
        <p>Trân trọng,<br>Đội ngũ Chăm sóc Sức khỏe<br>Hệ thống Healthcare</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }
}