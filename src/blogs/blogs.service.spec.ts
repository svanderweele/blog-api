// noinspection DuplicatedCode

import { BlogsService } from './blogs.service';
import { TestBed } from '@automock/jest';
import { BlogsRepository } from './blogs.repository';
import { faker } from '@faker-js/faker';
import { Blog } from './entities/blog.entity';
import { INTERFACE_TOKEN_BLOG_REPOSITORY } from './interfaces/blogs.interface.repository';
import { NotFoundException } from '@nestjs/common';
import { INTERFACE_TOKEN_CACHE_APP } from '@src/common/cache/cache.module';
import { AppCacheService } from '@src/common/cache/app.cache.service';

const createRandomBlogEntity = (): Blog => {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(5),
    subtitle: faker.word.words(5),
    content: faker.word.words(50),
    userId: faker.string.uuid(),
    image: null,
    deletedAt: null,
  };
};

describe('BlogService', () => {
  let sut: BlogsService;
  let repository: jest.Mocked<BlogsRepository>;
  let cache: jest.Mocked<AppCacheService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(BlogsService).compile();
    sut = unit;
    repository = unitRef.get(INTERFACE_TOKEN_BLOG_REPOSITORY);
    cache = unitRef.get(INTERFACE_TOKEN_CACHE_APP);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create blog', () => {
    const entity = createRandomBlogEntity();

    it('should create a blog', async () => {
      // Arrange
      repository.create.mockResolvedValue(entity);

      // Act
      const createdEntity = await sut.create({
        title: entity.title,
        subtitle: entity.subtitle,
        content: entity.content,
        userId: entity.userId,
      });

      // Assert
      expect(createdEntity.id).toBeDefined();
      expect(createdEntity.title).toBe(entity.title);
      expect(createdEntity.content).toBe(entity.content);
      expect(createdEntity.deletedAt).toBeNull();
      expect(createdEntity.image).toBeNull();
    });

    it('should throw an error when title is empty', async () => {
      // Arrange
      const payload = {
        title: '',
        subtitle: 'some content',
        content: 'some content',
        userId: 'some-id',
      };

      // Act
      const call = async () => {
        return await sut.create(payload);
      };

      // Assert
      await expect(call()).rejects.toThrow('title cannot be empty');
    });
    it('should throw an error when subtitle is empty', async () => {
      // Arrange
      const payload = {
        title: 'some title',
        subtitle: '',
        content: '',
        userId: 'some-id',
      };

      // Act
      const call = async () => {
        return await sut.create(payload);
      };

      // Assert
      await expect(call()).rejects.toThrow('subtitle cannot be empty');
    });
    it('should throw an error when content is empty', async () => {
      // Arrange
      const payload = {
        title: 'some title',
        subtitle: 'some content',
        content: '',
        userId: 'some-id',
      };

      // Act
      const call = async () => {
        return await sut.create(payload);
      };

      // Assert
      await expect(call()).rejects.toThrow('content cannot be empty');
    });
    it('should throw an error when user id is empty', async () => {
      // Arrange
      const payload = {
        title: 'some title',
        subtitle: 'subtitle',
        content: 'some content',
        userId: '',
      };

      // Act
      const call = async () => {
        return await sut.create(payload);
      };

      // Assert
      await expect(call()).rejects.toThrow('user id cannot be empty');
    });
  });
  describe('getting all blogs', () => {
    it('gets all blogs', async () => {
      // Arrange
      const blogEntities = [createRandomBlogEntity()];
      cache.getOrSet.mockResolvedValue(blogEntities);

      // Act
      const call = async () => {
        return await sut.getAll({ userId: 'some-user-id', bustCache: false });
      };

      // Assert
      await expect(call()).resolves.toStrictEqual(blogEntities);
    });
  });
  describe('getting blog by id', () => {
    const entity = createRandomBlogEntity();

    it('should return a blog', async () => {
      // Arrange
      cache.getOrSet.mockResolvedValue(entity);
      // Act
      const call = async () => {
        return await sut.get('blog-id', 'user-id', false);
      };
      // Assert
      await expect(call()).resolves.toStrictEqual(entity);
    });

    it('should throw not found error', async () => {
      // Arrange
      cache.getOrSet.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        return await sut.get('blog-id', 'user-id', false);
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
  describe('update blog', () => {
    it('should throw blog not found error', async () => {
      // Arrange
      repository.update.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        await sut.update(createRandomBlogEntity(), {
          title: faker.word.words(5),
          content: faker.word.words(50),
        });
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove blog', () => {
    it('should throw blog not found error', async () => {
      // Arrange
      repository.softDelete.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        await sut.softDelete(createRandomBlogEntity());
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
});
