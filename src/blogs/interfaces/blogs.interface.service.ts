import { StreamableFile } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';

export const INTERFACE_TOKEN_BLOG_SERVICE = 'IBlogService';

export interface IBlogService {
  /**
   * Creates a blog by the given payload
   * @param dto the dto of the blog
   * @throws BlogUnexpectedServiceError if an unexpected error occurs
   */
  create(dto: {
    title: string;
    content: string;
    authorId: string;
  }): Promise<Blog>;

  /**
   * Updates a blog by the given payload
   * @param id the id of the blog we want to update
   * @param dto the dto of the blog
   * @throws BlogNotFoundServiceError if no blog is found
   * @throws BlogUnexpectedServiceError if an unexpected error occurs
   */
  update(
    id: string,
    dto: { title?: string; content?: string; image?: string },
  ): Promise<Blog>;

  /**
   * Gets a blog by the id provided
   * @param id the id of the blog
   * @throws BlogNotFoundServiceError if no blog is found
   * @throws BlogUnexpectedServiceError if an unexpected error occurs
   */
  get(id: string): Promise<Blog>;

  getImage(id: string): Promise<StreamableFile>;
  /**
   * Gets all blogs
   * @throws BlogUnexpectedServiceError if an unexpected error occurs
   */
  getAll(): Promise<Blog[]>;

  /**
   * Soft deletes a blog
   * @param id the id of the blog
   * @throws BlogNotFoundServiceError if no blog is found
   * @throws BlogUnexpectedServiceError if an unexpected error occurs
   */
  softDelete(id: string): Promise<void>;
}
