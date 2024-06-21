import { Inject, Injectable } from '@nestjs/common';
import { Blog } from './entities/blog.entity';
import {
  IBlogRepository,
  INTERFACE_TOKEN_BLOG_REPOSITORY,
} from './interfaces/blogs.interface.repository';
import {
  GetAllRequest,
  IBlogService,
} from './interfaces/blogs.interface.service';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '@src/common/logger/logger.service';
import { ILogger } from '@src/common/logger/logger.interface';
import { INTERFACE_TOKEN_CACHE_APP } from '@src/common/cache/cache.module';
import { IAppCacheService } from '@src/common/cache/interface/app.cache.service.interface';

@Injectable()
export class BlogsService implements IBlogService {
  constructor(
    @Inject(INTERFACE_TOKEN_BLOG_REPOSITORY) private repo: IBlogRepository,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
    @Inject(INTERFACE_TOKEN_CACHE_APP)
    private readonly cacheService: IAppCacheService,
  ) {}

  async getAll(request: GetAllRequest): Promise<Blog[]> {
    this.logger.trace('[blogs.service.getAll]');
    return this.cacheService.getOrSet(
      `${request.userId}-all-blogs`,
      async () => {
        return await this.repo.getAll(request.userId);
      },
      request.bustCache,
    );
  }

  async get(
    id: string,
    userId: string,
    bustCache: boolean,
  ): Promise<Blog | null> {
    this.logger.trace('[blogs.service.get]', id);
    return this.cacheService.getOrSet(
      `blog-${id}`,
      async () => {
        return await this.repo.get(id, userId);
      },
      bustCache,
    );
  }

  async create(dto: {
    title: string;
    content: string;
    subtitle: string;
    userId: string;
  }): Promise<Blog> {
    this.logger.trace('[blogs.service.create]', dto);
    if (!dto.title) {
      this.logger.info('[blogs.service.create] Title was empty', dto);
      throw new Error('title cannot be empty');
    }
    if (!dto.subtitle) {
      this.logger.info('[blogs.service.create] Subtitle was empty', dto);
      throw new Error('subtitle cannot be empty');
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
      subtitle: dto.subtitle,
      content: dto.content,
      userId: dto.userId,
    });
  }

  async update(
    blog: Blog,
    dto: {
      title?: string;
      subtitle?: string;
      content?: string;
      image?: string;
    },
  ): Promise<Blog> {
    this.logger.trace('[blogs.service.update]', { blog, dto });
    return await this.repo.update(blog.id, {
      title: dto.title,
      subtitle: dto.subtitle,
      content: dto.content,
      image: dto.image,
    });
  }

  async softDelete(blog: Blog): Promise<void> {
    this.logger.trace('[blogs.service.softDelete]', blog);
    await this.repo.softDelete(blog);
  }
}
