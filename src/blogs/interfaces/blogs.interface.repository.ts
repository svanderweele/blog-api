import { Blog } from '../entities/blog.entity';

export const INTERFACE_TOKEN_BLOG_REPOSITORY = 'IBlogRepository';

export interface IBlogRepository {
  /**
   * Creates a blog by the given payload
   * @param dto the payload of the blog
   */
  create(dto: {
    title: string;
    subtitle: string;
    content: string;
    userId: string;
  }): Promise<Blog>;

  /**
   * Updates a blog by the given payload
   * @param id the blog id
   * @param dto the payload of the blog
   */
  update(
    id: string,
    dto: {
      title?: string;
      subtitle?: string;
      content?: string;
      image?: string;
    },
  ): Promise<Blog>;

  /**
   * Gets a blog by the id provided or null
   * @param id the id of the blog
   * @param userId the user's id
   */
  get(id: string, userId: string): Promise<Blog | null>;

  /**
   * Gets all blogs
   * @param userId the user's id
   */
  getAll(userId: string | null): Promise<Blog[]>;

  /**
   * Soft deletes a blog
   * @param id the id of the blog
   */
  softDelete(blog: Blog): Promise<void>;
}
