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

@Injectable()
export class BlogsService implements IBlogService {
  constructor(
    @Inject(INTERFACE_TOKEN_BLOG_REPOSITORY) private repo: IBlogRepository,
  ) {}

  async getAll(): Promise<Blog[]> {
    const blogs = await this.repo.getAll();
    return blogs;
  }

  async get(id: string): Promise<Blog | null> {
    return await this.repo.get(id);
  }

  async create(dto: {
    title: string;
    content: string;
    userId: string;
  }): Promise<Blog> {
    if (!dto.title) {
      throw new Error('title cannot be empty');
    }
    if (!dto.content) {
      throw new Error('content cannot be empty');
    }
    if (!dto.userId) {
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
    return await this.repo.update(blog.id, {
      title: dto.title,
      content: dto.content,
      image: dto.image,
    });
  }

  async softDelete(blog: Blog): Promise<void> {
    await this.repo.softDelete(blog);
  }

  async getImage(blog: Blog): Promise<StreamableFile> {
    try {
      if (!blog.image) {
        throw new NotFoundException();
      }

      const filePath = join(process.cwd(), 'client', blog.image);
      const file = createReadStream(filePath);
      return new StreamableFile(file);
    } catch (error) {
      //TODO: Log errors
      throw error;
    }
  }
}
