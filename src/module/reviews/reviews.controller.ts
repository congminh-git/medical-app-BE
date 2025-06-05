import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Reviews } from './reviews.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.reviewService.create(createDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

    @Get('/doctor/:id')
  findByDoctorId(@Param('id') id: string) {
    return this.reviewService.findByDoctorId(parseInt(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.reviewService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
