import { Blog } from '../entities/blog.entity';

export const INTERFACE_TOKEN_BLOG_REPOSITORY = 'IBlogRepository';

export interface IBlogRepository {
  /**
   * Creates a blog by the given payload
   * @param dto the payload of the blog
   * @throws BlogUnexpectedRepositoryError if an unexpected error occurs
   */
  create(dto: {
    title: string;
    content: string;
    userId: string;
  }): Promise<Blog>;

  /**
   * Updates a blog by the given payload
   * @param id the blog id
   * @param dto the payload of the blog
   * @throws BlogNotFoundRepositoryError if blog is not found
   * @throws BlogUnexpectedRepositoryError if an unexpected error occurs
   */
  update(
    id: string,
    dto: {
      title?: string;
      content?: string;
      image?: string;
    },
  ): Promise<Blog>;

  /**
   * Gets a blog by the id provided
   * @param id the id of the blog
   * @throws BlogNotFoundRepositoryError if no blog is found
   * @throws BlogUnexpectedRepositoryError if an unexpected error occurs
   */
  get(id: string): Promise<Blog | null>;

  /**
   * Gets all blogs
   * @throws BlogUnexpectedRepositoryError if an unexpected error occurs
   */
  getAll(): Promise<Blog[]>;

  /**
   * Soft deletes a blog
   * @param id the id of the blog
   * @throws BlogNotFoundRepositoryError if no blog is found
   * @throws BlogUnexpectedRepositoryError if an unexpected error occurs
   */
  softDelete(blog: Blog): Promise<void>;
}
