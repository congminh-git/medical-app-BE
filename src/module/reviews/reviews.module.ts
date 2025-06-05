import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './reviews.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews])], // Đăng ký repository
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [TypeOrmModule], // Export để module khác sử dụng
})
export class ReviewsModule {}
