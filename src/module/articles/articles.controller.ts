import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './articles.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Put('/article/:id/like/:userID')
  async findOne(
    @Param('id') id: number,
    @Param('userID') userID: number,
  ): Promise<Article | null> {
    return this.articlesService.findOneToLike(id, userID);
  }

  @Get('/article/:id/:slug')
  async findBySlug(
    @Param('id') id: number,
    @Param('slug') slug: string,
  ): Promise<Article | null> {
    return this.articlesService.findOneSlug(id, slug);
  }

  @Get('specialty/:specialty')
  async findBySpecialty(
    @Param('specialty') specialty: string,
  ): Promise<Article[]> {
    return this.articlesService.findBySpecialty(specialty);
  }

  @Post()
  async create(@Body() articleData: Partial<Article>): Promise<Article> {
    return this.articlesService.create(articleData);
  }

  @Put(':id/:slug')
  async update(
    @Param('id') id: number,
    @Param('slug') slug: string,
    @Body() articleData: Partial<Article>,
  ): Promise<Article> {
    return this.articlesService.update(id, slug, articleData);
  }

  @Delete(':id/:doctorID')
  async delete(
    @Param('id') id: number,
    @Param('doctorID') doctorID: number,
  ): Promise<void> {
    return this.articlesService.delete(id, doctorID);
  }

  @Get('latest')
  async findLatestThree(): Promise<Article[]> {
    return this.articlesService.findLatestThree();
  }

  @Get('top-views')
  async findTopViewed(): Promise<Article[]> {
    return this.articlesService.findTopViewed();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number): Promise<Article[]> {
    return this.articlesService.findByUser(userId);
  }

  @Get('random')
  async getRandomArticle(): Promise<Article[] | null> {
    return this.articlesService.getRandomArticles();
  }

  @Get('care')
  async getCareArticles(
    @Query('diseases') diseases: string,
    @Query('symptoms') symptoms: string,
  ): Promise<Article[]> {
    return this.articlesService.getCareArticles(diseases, symptoms);
  }
}
