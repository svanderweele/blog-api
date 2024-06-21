import { EntityNotFoundError, FindManyOptions, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBlogRepository } from './interfaces/blogs.interface.repository';
import { ILogger } from '@src/common/logger/logger.interface';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '@src/common/logger/logger.service';

@Injectable()
export class BlogsRepository implements IBlogRepository {
  constructor(
    @InjectRepository(Blog) private repo: Repository<Blog>,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}

  async create(dto: {
    title: string;
    content: string;
    subtitle: string;
    userId: string;
  }): Promise<Blog> {
    try {
      const entity = this.repo.create({
        title: dto.title,
        subtitle: dto.subtitle,
        content: dto.content,
        userId: dto.userId,
      });
      await this.repo.insert(entity);
      return this.repo.findOneOrFail({ where: { id: entity.id } });
    } catch (error) {
      this.logger.error(
        '[blogs.repository.create] Failed to create blog in database',
        error,
        {
          dto,
        },
      );

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
      this.logger.error(
        '[blogs.repository.update] Failed to update blog in database',
        error,
        {
          id,
          dto,
        },
      );
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async getAll(userId: string | null): Promise<Blog[]> {
    try {
      const queryOptions: FindManyOptions<Blog> = {
        withDeleted: true,
      };

      if (userId) {
        queryOptions.where = { userId };
      }

      return await this.repo.find(queryOptions);
    } catch (error) {
      this.logger.error(
        '[blogs.repository.getAll] Failed to get all blogs',
        error,
      );
      throw error;
    }
  }

  async get(id: string, userId: string): Promise<Blog | null> {
    try {
      return await this.repo.findOne({
        where: { id, userId },
      });
    } catch (error) {
      this.logger.error(
        '[blogs.repository.get] Failed to get blog by id',
        error,
        id,
      );
      throw error;
    }
  }

  async softDelete(blog: Blog): Promise<void> {
    try {
      await this.repo.softDelete(blog.id);
    } catch (error) {
      this.logger.error(
        '[blogs.repository.softDelete] Failed to delete blog',
        error,
        blog,
      );

      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
