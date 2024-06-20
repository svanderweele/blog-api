import { StreamableFile } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';

export const INTERFACE_TOKEN_BLOG_SERVICE = 'IBlogService';

export interface IBlogService {
  /**
   * Creates a blog by the given payload
   * @param dto the dto of the blog
   */
  create(dto: {
    title: string;
    content: string;
    userId: string;
  }): Promise<Blog>;

  /**
   * Updates a blog by the given payload
   * @param id the id of the blog we want to update
   * @param dto the dto of the blog
   */
  update(
    blog: Blog,
    dto: { title?: string; content?: string; image?: string },
  ): Promise<Blog>;

  /**
   * Gets a blog by the id provided
   * @param id the id of the blog
   * @param userId the user's id
   */
  get(id: string, userId: string): Promise<Blog>;

  /**
   * Gets the image of a blog
   * @param blog the blog
   */
  getImage(blog: Blog): Promise<StreamableFile>;
  /**
   * Gets all blogs
   * @param userId the user's id
   */
  getAll(userId: string): Promise<Blog[]>;

  /**
   * Soft deletes a blog
   * @param blog the blog
   */
  softDelete(blog: Blog): Promise<void>;
}
