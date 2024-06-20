import { TestBed } from '@automock/jest';
import { BlogsRepository } from './blogs.repository';
import { faker } from '@faker-js/faker';
import { Blog } from './entities/blog.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const createRandomBlogEntity = (): Blog => {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(),
    content: faker.word.words({ count: 50 }),
    userId: faker.string.uuid(),
    image: null,
    deletedAt: null,
  };
};

const request: any = {
  user: { sub: 'user', username: 'username' },
};

describe('BlogRepository', () => {
  let sut: BlogsRepository;
  let repository: jest.Mocked<Repository<Blog>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(BlogsRepository).compile();
    sut = unit;
    repository = unitRef.get(getRepositoryToken(Blog) as string);
  });

  describe('getting all blogs', () => {
    it('should get blogs', async () => {
      // Arrange
      const blogs = [createRandomBlogEntity(), createRandomBlogEntity()];
      repository.find.mockResolvedValue(blogs);

      // Act
      const call = () => sut.getAll(request);

      // Assert
      await expect(call()).resolves.toBe(blogs);
    });
  });

  describe('getting blog by id', () => {
    it('should get a blog', async () => {
      // Arrange
      const entity = createRandomBlogEntity();
      repository.findOne.mockResolvedValue(entity);

      // Act
      const call = () => sut.get(request, entity.id);

      // Assert
      await expect(call()).resolves.toBe(entity);
    });

    it('if entity is not found it should return null', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act
      const call = () => sut.get(request, faker.string.uuid());

      // Assert
      await expect(call()).resolves.toBeNull();
    });
  });

  describe('creating a blog', () => {
    it('should create and return', async () => {
      // Arrange
      const entity = createRandomBlogEntity();
      repository.create.mockImplementation(() => {
        return entity;
      });
      repository.findOneOrFail.mockResolvedValue(entity);

      // Act
      const call = () =>
        sut.create({
          title: faker.word.words(5),
          content: faker.word.words(50),
          userId: faker.string.uuid(),
        });

      // Assert
      await expect(call()).resolves.toBe(entity);
    });
  });

  describe('updating a blog', () => {
    it('should update a blog and return', async () => {
      // Arrange
      const entity = createRandomBlogEntity();
      repository.findOneOrFail.mockResolvedValue(entity);

      // Act
      const call = () =>
        sut.update(entity.id, {
          title: faker.word.words(5),
          content: faker.word.words(50),
        });

      // Assert
      await expect(call()).resolves.toBe(entity);
    });
    it('should return a missing entity repository error', async () => {
      // Arrange
      repository.update.mockRejectedValue(
        new EntityNotFoundError(Blog, 'Mock Error'),
      );

      // Act
      const call = () =>
        sut.update(faker.string.uuid(), {
          title: faker.word.words(5),
          content: faker.word.words(50),
        });

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleting a blog', () => {
    it('should return a missing entity repository error', async () => {
      // Arrange
      repository.softDelete.mockRejectedValue(
        new EntityNotFoundError(Blog, 'Mock Error'),
      );

      // Act
      const call = () => sut.softDelete(createRandomBlogEntity());

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
});
