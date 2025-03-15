import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './articles.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article | null> {
    return await this.articleRepository.findOne({ where: { id: id } });
  }

  async findBySpecialty(specialty: string): Promise<Article[]> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.specialties LIKE :specialty', { specialty: `%${specialty}%` })
      .getMany();
  }

  async create(articleData: Partial<Article>): Promise<Article> {
    const article = this.articleRepository.create(articleData);
    return await this.articleRepository.save(article);
  }

  async update(id: number, articleData: Partial<Article>): Promise<Article> {
    await this.articleRepository.update(id, articleData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
