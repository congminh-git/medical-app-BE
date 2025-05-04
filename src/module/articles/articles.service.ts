import { Injectable, NotFoundException } from '@nestjs/common';
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
    const article = await this.articleRepository.findOne({ where: { id: id } });
    return article
  }

  async findOneToLike(id: number, userID: number): Promise<Article | null> {
    const article = await this.articleRepository.findOne({ where: { id: id } });
    if (article.likes.includes(userID.toString())) {
      article.likes = article.likes.replace(`${userID}, `, "")
      console.log(article.likes)
      this.articleRepository.save(article)
      console.log("A")
    } else {
      article.likes += `${userID}, `
      this.articleRepository.save(article)
    }
    return article
  }

  async findOneSlug(id: number, slug: string): Promise<Article | null> {
    const article = await this.articleRepository
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.doctor", "doctor") // Join bảng doctors
      .leftJoinAndSelect("doctor.user", "user") // Join bảng users thông qua bảng doctors
      .select(["article", "doctor.user_id", "user.full_name"]) // Chọn thông tin cần thiết
      .where("article.id = :id", { id })
      .getOne();

    const generatedSlug = article.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    if (slug !== generatedSlug) {
      throw new NotFoundException(`/${id}?slug=${generatedSlug}`);
    } else {
      article.views += 1
      await this.articleRepository.save(article)
    }

    return article;
  }

  async findBySpecialty(specialty: string): Promise<Article[]> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.specialties LIKE :specialty', { specialty: `%${specialty}%` })
      .getMany();
  }

  async create(articleData: Partial<Article>): Promise<Article> {
    articleData.views = 0
    articleData.likes = ""
    const article = this.articleRepository.create(articleData);
    return await this.articleRepository.save(article);
  }

  async update(id: number, slug: string, articleData: Partial<Article>): Promise<Article> {
    const article = await this.findOne(id);
    if (!article) {
      throw new NotFoundException(`Bài viết có ID ${id} không tồn tại.`);
    }
  
    // Tạo slug từ tiêu đề bài viết
    const generatedSlug = article.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  
    // Nếu slug truyền vào không khớp, ném lỗi với đường dẫn đúng
    if (slug !== generatedSlug) {
      throw new NotFoundException(`/${id}?slug=${generatedSlug}`);
    }
  
    // Nếu slug hợp lệ, tiến hành cập nhật bài viết
    await this.articleRepository.update(id, articleData);
  
    // Trả về bài viết sau khi cập nhật
    return this.findOne(id);
  }  

  async delete(id: number, doctorID: number): Promise<void> {
    await this.articleRepository.delete({ id, doctor_id: doctorID });
  }

  async findLatestThree(): Promise<Article[]> {
    const articles = await this.articleRepository.find({
      order: { created_at: 'DESC' },
      take: 5,
    });
  
    return articles;
  }
  
  async findTopViewed(): Promise<Article[]> {
    const articles = await this.articleRepository.find({
      order: { views: 'DESC' },
      take: 6,
    });
  
    return articles;
  }

  async findByUser(userId: number): Promise<Article[]> {
    return await this.articleRepository.find({
      where: { doctor_id: userId },
    });
  }  
}
