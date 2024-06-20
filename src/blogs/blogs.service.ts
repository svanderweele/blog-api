import {
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Blog } from './entities/blog.entity';
import {
  IBlogRepository,
  INTERFACE_TOKEN_BLOG_REPOSITORY,
} from './interfaces/blogs.interface.repository';
import { IBlogService } from './interfaces/blogs.interface.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '@src/common/logger/logger.service';
import { ILogger } from '@src/common/logger/logger.interface';
import * as fs from 'fs';

@Injectable()
export class BlogsService implements IBlogService {
  constructor(
    @Inject(INTERFACE_TOKEN_BLOG_REPOSITORY) private repo: IBlogRepository,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}

  async getAll(): Promise<Blog[]> {
    this.logger.trace('[blogs.service.getAll]');
    const blogs = await this.repo.getAll();
    return blogs;
  }

  async get(id: string): Promise<Blog | null> {
    this.logger.trace('[blogs.service.get]', id);
    return await this.repo.get(id);
  }

  async create(dto: {
    title: string;
    content: string;
    userId: string;
  }): Promise<Blog> {
    this.logger.trace('[blogs.service.create]', dto);
    if (!dto.title) {
      this.logger.info('[blogs.service.create] Title was empty', dto);
      throw new Error('title cannot be empty');
    }
    if (!dto.content) {
      this.logger.info('[blogs.service.create] Content was empty', dto);
      throw new Error('content cannot be empty');
    }
    if (!dto.userId) {
      this.logger.info('[blogs.service.create] User Id was empty', dto);
      throw new Error('user id cannot be empty');
    }

    return await this.repo.create({
      title: dto.title,
      content: dto.content,
      userId: dto.userId,
    });
  }

  async update(
    blog: Blog,
    dto: {
      title?: string;
      content?: string;
      image?: string;
    },
  ): Promise<Blog> {
    this.logger.trace('[blogs.service.update]', { blog, dto });
    return await this.repo.update(blog.id, {
      title: dto.title,
      content: dto.content,
      image: dto.image,
    });
  }

  async softDelete(blog: Blog): Promise<void> {
    this.logger.trace('[blogs.service.softDelete]', blog);
    await this.repo.softDelete(blog);
  }

  async getImage(blog: Blog): Promise<StreamableFile> {
    try {
      this.logger.trace('[blogs.service.getImage]', blog);
      if (!blog.image) {
        throw new NotFoundException();
      }

      const filePath = join(process.cwd(), 'client', blog.image);

      const doesFileExist = fs.existsSync(filePath);

      if (!doesFileExist) {
        this.logger.error('[blogs.service.getImage] File does not exist ', {
          blog,
        });
        throw new NotFoundException();
      }

      const stream = createReadStream(filePath);
      return new StreamableFile(stream);
    } catch (error) {
      this.logger.error(
        '[blogs.service.getImage] Failed to get blog image',
        error,
        {
          blog,
        },
      );

      throw error;
    }
  }
}
