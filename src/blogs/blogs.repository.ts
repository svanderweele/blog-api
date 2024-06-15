import { EntityNotFoundError, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogNotFoundRepositoryError } from './blogs.errors';

@Injectable()
export class BlogsRepository {
  constructor(@InjectRepository(Blog) private repo: Repository<Blog>) {}

  async createBlog(
    createBlogDto: CreateBlogDto,
    _authorId: string,
  ): Promise<Blog> {
    const entity = this.repo.create(createBlogDto);

    try {
      await this.repo.insert(entity);
      return entity;
    } catch (error) {
      // log database error
      throw error;
    }
  }

  getBlogs(): Promise<Blog[]> {
    return this.repo.find({ withDeleted: true });
  }

  async getBlog(id: string): Promise<Blog> {
    try {
      return await this.repo.findOneOrFail({
        where: { id },
        withDeleted: true,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BlogNotFoundRepositoryError();
      }
      throw error;
    }
  }

  async updateBlog(id: string, updateBlogDto: Partial<Blog>): Promise<void> {
    try {
      await this.repo.update(id, updateBlogDto);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BlogNotFoundRepositoryError();
      }
      throw error;
    }
  }

  async removeBlog(id: string): Promise<void> {
    await this.getBlog(id);
    await this.repo.softDelete(id);
  }
}
