import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './module/auth/jwt-auth.guard';
import { JwtStrategy } from './module/auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './module/users/users.module';
import { PatientsModule } from './module/patients/patients.module';
import { DoctorsModule } from './module/doctors/doctors.module';
import { ArticlesModule } from './module/articles/articles.module';
import { SpecialtiesModule } from './module/specialties/specialties.module';
import { AppointmentsModule } from './module/appointments/appointments.module';
import { MessagesModule } from './module/messages/messages.module';
import { GpayModule } from './module/gpay/gpay.module';
import { MailModule } from './module/mail/mail.module';
import { SymptomsModule } from './module/symptoms/symptoms.module';
import { PrescriptionsModule } from './module/prescriptions/prescriptions.module';
import { ConsultationsModule } from './module/consultations/consultations.module';
import { DiseaseTypesModule } from './module/diseaseTypes/diseaseTypes.module';
import { DiagnosisModule } from './module/diagnosis/diagnosis.module';
import { MedicineTypesModule } from './module/medicineTypes/medicineTypes.module';
import { ReviewsModule } from './module/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env'], // Tải theo thứ tự, file đầu tiên được ưu tiên
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        ssl: {
          rejectUnauthorized: false, // thường dùng để bỏ qua việc xác thực chứng chỉ SSL (không khuyến nghị dùng cho production)
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    PatientsModule,
    DoctorsModule,
    ArticlesModule,
    SpecialtiesModule,
    AppointmentsModule,
    MessagesModule,
    GpayModule,
    MailModule,
    SymptomsModule,
    PrescriptionsModule,
    ConsultationsModule,
    DiseaseTypesModule,
    DiagnosisModule,
    MedicineTypesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
