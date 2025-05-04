import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.consultationsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.consultationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.consultationsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationsService.remove(+id);
  }
}
