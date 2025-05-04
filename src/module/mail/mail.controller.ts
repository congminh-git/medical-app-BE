// src/mail/mail.controller.ts

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../auth/auth.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('warning')
  async sendWarning(@Body() body: { to: string; name: string }) {
    const { to, name } = body;
    const info = await this.mailService.sendWarningEmail(to, name);
    return { message: 'Warning email sent', messageId: info.messageId };
  }

  @Public()
  @Post('blocked')
  async sendBlocked(@Body() body: { to: string; name: string }) {
    const { to, name } = body;
    const info = await this.mailService.sendAccountBlockedEmail(to, name);
    return { message: 'Account blocked email sent', messageId: info.messageId };
  }

  @Public()
  @Get('confirm')
  async confirmAppointment(
    @Query('appointmentID') appointmentID: number,
    @Query('response') response: string,
  ) {
    await this.mailService.confirmAppointment(appointmentID, response);

    // Return a simple HTML response
    return response == 'yes' ? (`
      <html>
        <head>
          <title>Xác nhận tham gia</title>
        </head>
        <body>
          <h1>Xác nhận tham gia đúng lịch tư vấn</h1>
          <p>Cảm ơn bạn đã chuẩn bị thời gian để tham gia tư vấn đúng lịch hẹn, hãy lưu ý thời gian để gặp bác sĩ đúng giờ nhé. Chúc bạn có một buổi phỏng vấn tốt đẹp</p>
          <p>Cảm ơn phản hồi của bạn!</p>
        </body>
      </html>
    `) : (
      `<html>
        <head>
          <title>Xác nhận tham gia</title>
        </head>
        <body>
          <h1>Xác nhận không tham gia đúng lịch</h1>
          <p>Thật tiếc khi bạn không thể sắp xếp thời gian để tham gia tư vấn đúng với lịch đã đăng ký. Hãy lưu ý vấn đề này để sắp xếp thờ gian trong các lần sau. Chúng tôi hy vọng vẫn có cơ hội tư vấn sức khỏe cho bạn</p>
          <p>Cảm ơn phản hồi của bạn!</p>
        </body>
      </html>`
    );
  }

  @Public()
  @Post('confirmation/:id')
  async sendConfirmation(@Param('id') apointmentID: number) {
    const info = await this.mailService.sendConfirmationEmail(apointmentID);
    return { message: 'Confirmation email sent', messageId: info.messageId };
  }

  @Public()
  @Get('reSchedule-confirm')
  async confirmReschedule(
    @Query('appointmentID') appointmentID: number,
    @Query('beforeAppointment') beforeAppointmentID: number,
    @Query('response') response: string,
  ) {
    await this.mailService.confirmReSchedule(appointmentID, beforeAppointmentID, response);

    // Return a simple HTML response
    return response == 'yes' ? (`
      <html>
        <head>
          <title>Hỗ trợ đổi lịch</title>
        </head>
        <body>
          <p>Bạn đã xác nhận đổi lịch hẹn của mình sớm 30ph để hỗ trợ bác sĩ và các bệnh nhân khác</p>
          <p>Cảm ơn vì sự giúp đỡ này</p>
        </body>
      </html>
    `) : (
      `<html>
        <head>
          <title>Hỗ trợ đổi lịch</title>
        </head>
        <body>
          <p>Thật tiếc khi bạn không thể đổi lịch hẹn sớm hơn</p>
          <p>Cảm ơn phản hồi hỗ trợ của bạn!</p>
        </body>
      </html>`
    );
  }
}