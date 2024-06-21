// noinspection DuplicatedCode

import { BlogsService } from './blogs.service';
import { TestBed } from '@automock/jest';
import { BlogsRepository } from './blogs.repository';
import { faker } from '@faker-js/faker';
import { Blog } from './entities/blog.entity';
import { INTERFACE_TOKEN_BLOG_REPOSITORY } from './interfaces/blogs.interface.repository';
import { NotFoundException } from '@nestjs/common';

const createRandomBlogEntity = (): Blog => {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(5),
    content: faker.word.words(50),
    userId: faker.string.uuid(),
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
    repository = unitRef.get(INTERFACE_TOKEN_BLOG_REPOSITORY);
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
    it('should throw an error when content is empty', async () => {
      // Arrange
      const payload = {
        title: 'some title',
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
      repository.getAll.mockResolvedValue(blogEntities);

      // Act
      const call = async () => {
        return await sut.getAll({ userId: 'some-user-id' });
      };

      // Assert
      await expect(call()).resolves.toStrictEqual(blogEntities);
    });
  });
  describe('getting blog by id', () => {
    const entity = createRandomBlogEntity();

    it('should return a blog', async () => {
      // Arrange
      repository.get.mockResolvedValue(entity);
      // Act
      const call = async () => {
        return await sut.get('blog-id', 'user-id');
      };
      // Assert
      await expect(call()).resolves.toStrictEqual(entity);
    });

    it('should throw not found error', async () => {
      // Arrange
      repository.get.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        return await sut.get('blog-id', 'user-id');
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

  describe('get image', () => {
    it('should throw blog not found error', async () => {
      // Arrange
      repository.get.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        await sut.getImage(createRandomBlogEntity());
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });

    it('should throw image not found error', async () => {
      // Arrange
      const entity = createRandomBlogEntity();
      repository.get.mockResolvedValue(entity);

      // Act
      const call = async () => {
        await sut.getImage(entity);
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
});
