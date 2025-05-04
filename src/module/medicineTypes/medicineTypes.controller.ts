import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MedicineTypesService } from './medicineTypes.service';
import { MedicineType } from './medicineTypes.entity';

@Controller('medicineTypes')
export class MedicineTypesController {
  constructor(private readonly medicineTypesService: MedicineTypesService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.medicineTypesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.medicineTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineTypesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.medicineTypesService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineTypesService.remove(+id);
  }
}
