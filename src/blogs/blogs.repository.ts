import { EntityNotFoundError, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBlogRepository } from './interfaces/blogs.interface.repository';

@Injectable()
export class BlogsRepository implements IBlogRepository {
  constructor(@InjectRepository(Blog) private repo: Repository<Blog>) {}

  async create(dto: {
    title: string;
    content: string;
    authorId: string;
  }): Promise<Blog> {
    try {
      const entity = this.repo.create({
        title: dto.title,
        content: dto.content,
        authorId: dto.authorId,
      });
      await this.repo.insert(entity);
      return this.repo.findOneOrFail({ where: { id: entity.id } });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    dto: { title?: string; content?: string; image?: string },
  ): Promise<Blog> {
    try {
      await this.repo.update(id, dto);
      return this.repo.findOneOrFail({ where: { id: id } });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async getAll(): Promise<Blog[]> {
    try {
      return await this.repo.find({ withDeleted: true });
    } catch (error) {
      throw error;
    }
  }

  async get(id: string): Promise<Blog> {
    try {
      return await this.repo.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.repo.findOneOrFail({ where: { id } });
      await this.repo.softDelete(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
