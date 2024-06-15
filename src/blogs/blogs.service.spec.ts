// noinspection DuplicatedCode

import { BlogsService } from './blogs.service';
import { TestBed } from '@automock/jest';
import { BlogsRepository } from './blogs.repository';
import {
  BlogNotFoundRepositoryError,
  BlogNotFoundServiceError,
} from './blogs.errors';
import { faker } from '@faker-js/faker';
import { Blog } from './entities/blog.entity';
import { GetBlogDto } from './dto/get-blog.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

const createRandomBlogEntity = (): Blog => {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(),
    description: faker.word.words({ count: 50 }),
    authorId: faker.string.uuid(),
    image: null,
    deletedAt: null,
  };
};

describe('BlogService', () => {
  let sut: BlogsService;
  let repository: jest.Mocked<BlogsRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(BlogsService).compile();
    sut = unit;
    repository = unitRef.get(BlogsRepository);
  });

  describe('create blog', () => {
    const entity = createRandomBlogEntity();

    it('should create a blog', async () => {
      repository.createBlog.mockResolvedValue(entity);
      const createDto: CreateBlogDto = {
        ...entity,
      };
      const createdEntity = await sut.create(createDto);
      expect(createdEntity.id).toBeDefined();
      expect(createdEntity.title).toBe(createDto.title);
      expect(createdEntity.description).toBe(createDto.description);
      expect(createdEntity.deletedAt).toBeNull();
      expect(createdEntity.image).toBeNull();
    });

    it('should rethrow unexpected error', async () => {
      const error = new Error('Something blew up');
      repository.createBlog.mockRejectedValue(error);
      const createDto: CreateBlogDto = {
        ...entity,
      };

      await expect(sut.create(createDto)).rejects.toThrow(error);
    });
  });
  describe('getting all blogs', () => {
    it('gets all blogs', async () => {
      const blogEntities = [createRandomBlogEntity()];
      repository.getBlogs.mockResolvedValue(blogEntities);
      const dtos = blogEntities.map((entity) => {
        const dto: GetBlogDto = {
          ...entity,
        };
        return dto;
      });
      await expect(sut.getAll()).resolves.toStrictEqual(dtos);
    });
    it('should rethrow unexpected error', async () => {
      const error = new Error('Some random error');
      repository.getBlogs.mockRejectedValue(error);
      await expect(sut.getAll()).rejects.toThrow(error);
    });
  });
  describe('getting blog by id', () => {
    const entity = createRandomBlogEntity();

    it('should return a blog', async () => {
      repository.getBlog.mockResolvedValue(entity);
      const dto: GetBlogDto = {
        ...entity,
      };
      await expect(sut.get(entity.id)).resolves.toStrictEqual(dto);
    });

    it('should throw not found error', async () => {
      repository.getBlog.mockRejectedValue(new BlogNotFoundRepositoryError());
      await expect(sut.get(faker.string.uuid())).rejects.toThrow(
        new BlogNotFoundServiceError(),
      );
    });

    it('should rethrow unexpected error', async () => {
      const error = new Error('Some random error');
      repository.getBlog.mockRejectedValue(error);
      await expect(sut.get(faker.string.uuid())).rejects.toThrow(error);
    });
  });
  describe('update blog', () => {
    const entity = createRandomBlogEntity();

    it('should throw blog not found error', async () => {
      repository.getBlog.mockRejectedValue(new BlogNotFoundRepositoryError());
      const updateDto: UpdateBlogDto = {
        ...entity,
      };
      await expect(sut.update(entity.id, updateDto)).rejects.toThrow(
        new BlogNotFoundServiceError(),
      );
    });
    it('should rethrow unexpected error', async () => {
      repository.getBlog.mockResolvedValue(entity);
      const error = new Error('Something blew up');
      repository.updateBlog.mockRejectedValue(error);
      const updateDto: UpdateBlogDto = {
        ...entity,
      };

      await expect(sut.update(entity.id, updateDto)).rejects.toThrow(error);
    });
  });
  describe('remove blog', () => {
    const entity = createRandomBlogEntity();

    it('should throw blog not found error', async () => {
      repository.removeBlog.mockImplementation(() => {
        throw new BlogNotFoundRepositoryError();
      });
      await expect(sut.remove(entity.id)).rejects.toThrow(
        new BlogNotFoundServiceError(),
      );
    });
    it('should rethrow unexpected error', async () => {
      const error = new Error('Something blew up');
      repository.removeBlog.mockImplementation(() => {
        throw error;
      });

      await expect(sut.remove(entity.id)).rejects.toThrow(error);
    });
  });
});
