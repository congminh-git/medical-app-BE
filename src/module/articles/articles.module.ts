import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctors/doctors.entity';
import { Article } from './articles.entity';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Doctor])], // Đăng ký repository
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class ArticlesModule {}
