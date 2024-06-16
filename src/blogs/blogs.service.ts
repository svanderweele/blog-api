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

  async get(id: string): Promise<Blog> {
    return await this.repo.get(id);
  }

  async create(dto: {
    title: string;
    content: string;
    authorId: string;
  }): Promise<Blog> {
    return await this.repo.create({
      title: dto.title,
      content: dto.content,
      authorId: dto.authorId,
    });
  }

  async update(
    id: string,
    dto: {
      title?: string;
      content?: string;
      image?: string;
    },
  ): Promise<Blog> {
    return await this.repo.update(id, {
      title: dto.title,
      content: dto.content,
      image: dto.image,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async getImage(id: string): Promise<StreamableFile> {
    try {
      const blog = await this.repo.get(id);
      if (!blog.image) {
        //TODO: Log that image was not found
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
