import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './entities/blog.entity';
import { BlogsRepository } from './blogs.repository';
import { BlogNotFoundServiceError, BlogRepositoryError } from './blogs.errors';
import { GetBlogDto } from './dto/get-blog.dto';

// We only need one account for the time being
const USER_ID = '37a1552d-cb44-4962-8843-38517ef8073f';

@Injectable()
export class BlogsService {
  constructor(private repo: BlogsRepository) {}

  async create(createBlogDto: CreateBlogDto): Promise<GetBlogDto> {
    try {
      const newBlog = await this.repo.createBlog(createBlogDto, USER_ID);
      return this.mapToDto(newBlog);
    } catch (error) {
      // log database error
      throw error;
    }
  }

  async getAll(): Promise<GetBlogDto[]> {
    const blogs = await this.repo.getBlogs();
    return blogs.map(this.mapToDto);
  }

  async get(id: string): Promise<GetBlogDto> {
    try {
      const entity = await this.repo.getBlog(id);
      return this.mapToDto(entity);
    } catch (error: unknown) {
      if (error instanceof BlogRepositoryError) {
        if (error.code === 'blog_not_found') {
          throw new BlogNotFoundServiceError();
        }
      }

      throw error;
    }
  }

  async update(id: string, updateBlogDto: Partial<Blog>): Promise<void> {
    const blog = await this.get(id);
    await this.repo.updateBlog(blog.id, updateBlogDto);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repo.removeBlog(id);
    } catch (error) {
      if (error instanceof BlogRepositoryError) {
        if (error.code === 'blog_not_found') {
          throw new BlogNotFoundServiceError();
        }
      }
      throw error;
    }
  }

  private mapToDto(entity: Blog): GetBlogDto {
    return {
      ...entity,
    };
  }
}
