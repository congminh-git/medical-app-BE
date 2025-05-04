import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @Post()
  create(@Body() createDto: any) {
    return this.prescriptionsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.prescriptionsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(+id);
  }
}
