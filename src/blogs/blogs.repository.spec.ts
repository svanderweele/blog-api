// noinspection DuplicatedCode

import { TestBed } from '@automock/jest';
import { BlogsRepository } from './blogs.repository';
import { BlogNotFoundRepositoryError } from './blogs.errors';
import { faker } from '@faker-js/faker';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

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

describe('BlogRepository', () => {
  let sut: BlogsRepository;
  let repository: jest.Mocked<Repository<Blog>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(BlogsRepository).compile();
    sut = unit;
    repository = unitRef.get(getRepositoryToken(Blog) as string);
  });

  describe('create blog', () => {
    const entity = createRandomBlogEntity();

    it('should create blog', async () => {
      repository.create.mockImplementation(() => {
        return entity;
      });

      const createDto: CreateBlogDto = {
        ...entity,
      };
      await expect(
        sut.createBlog(createDto, faker.string.uuid()),
      ).resolves.toEqual(entity);
    });

    it('should rethrow unexpected error', async () => {
      const error = new Error('Something blew up');
      repository.insert.mockRejectedValue(error);
      const createDto: CreateBlogDto = {
        ...entity,
      };

      await expect(
        sut.createBlog(createDto, faker.string.uuid()),
      ).rejects.toThrow(error);
    });
  });

  describe('getting all blogs', () => {
    it('gets all blogs', async () => {
      const blogs = [createRandomBlogEntity(), createRandomBlogEntity()];
      repository.find.mockResolvedValue(Promise.resolve(blogs));
      await expect(sut.getBlogs()).resolves.toBe(blogs);
    });
    it('should rethrow unexpected error', async () => {
      const error = new Error('Unexpected error');
      repository.find.mockRejectedValue(error);
      await expect(sut.getBlogs()).rejects.toThrow(error);
    });
  });
  describe('getting blog by id', () => {
    it('should return a blog', async () => {
      const blogs = [createRandomBlogEntity(), createRandomBlogEntity()];
      repository.find.mockResolvedValue(Promise.resolve(blogs));
      await expect(sut.getBlogs()).resolves.toBe(blogs);
    });
    it('should rethrow unexpected error', async () => {
      const error = new Error('Unexpected error');
      repository.findOneOrFail.mockRejectedValue(error);
      await expect(sut.getBlog(faker.string.uuid())).rejects.toThrow(error);
    });
  });
  describe('update blog', () => {
    const entity = createRandomBlogEntity();

    it('should throw blog not found error', async () => {
      repository.update.mockRejectedValue(new EntityNotFoundError(Blog, {}));
      const updateDto: UpdateBlogDto = {
        ...entity,
      };
      await expect(sut.updateBlog(entity.id, updateDto)).rejects.toThrow(
        new BlogNotFoundRepositoryError(),
      );
    });
    it('should rethrow unexpected error', async () => {
      const error = new Error('Something blew up');
      repository.update.mockRejectedValue(error);
      const updateDto: UpdateBlogDto = {
        ...entity,
      };
      await expect(sut.updateBlog(entity.id, updateDto)).rejects.toThrow(error);
    });
  });
  describe('remove blog', () => {
    it('should throw blog not found error', async () => {
      repository.findOneOrFail.mockRejectedValue(
        new EntityNotFoundError(Blog, {}),
      );
      await expect(sut.removeBlog(faker.string.uuid())).rejects.toThrow(
        new BlogNotFoundRepositoryError(),
      );
    });
    it('should rethrow unexpected error', async () => {
      const error = new Error('Unexpected error');
      repository.softDelete.mockRejectedValue(error);
      await expect(sut.removeBlog(faker.string.uuid())).rejects.toThrow(error);
    });
  });
});
