import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './articles.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Article | null> {
    return this.articlesService.findOne(id);
  }

  @Get('specialty/:specialty')
  async findBySpecialty(@Param('specialty') specialty: string): Promise<Article[]> {
    return this.articlesService.findBySpecialty(specialty);
  }

  @Post()
  async create(@Body() articleData: Partial<Article>): Promise<Article> {
    return this.articlesService.create(articleData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() articleData: Partial<Article>): Promise<Article> {
    return this.articlesService.update(id, articleData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.articlesService.delete(id);
  }
}
