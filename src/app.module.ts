import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './module/auth/jwt-auth.guard';
import { JwtStrategy } from './module/auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './module/users/users.module';
import { PatientsModule } from './module/patients/patients.module';
import { Doctor } from './module/doctors/doctors.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'medical_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    PatientsModule,
    Doctor
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
  ],
})

export class AppModule {}
