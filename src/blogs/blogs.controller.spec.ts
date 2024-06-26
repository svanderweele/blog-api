// noinspection DuplicatedCode
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TestBed } from '@automock/jest';
import { Blog } from './entities/blog.entity';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { INTERFACE_TOKEN_BLOG_SERVICE } from './interfaces/blogs.interface.service';

const createRandomBlogEntity = (): Blog => {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(),
    subtitle: faker.word.words(),
    content: faker.word.words({ count: 50 }),
    userId: faker.string.uuid(),
    image: null,
    deletedAt: null,
  };
};

const request: any = {
  user: { sub: 'user', username: 'username' },
};

describe('BlogsController', () => {
  let sut: BlogsController;
  let service: jest.Mocked<BlogsService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(BlogsController).compile();

    sut = unit;
    service = unitRef.get(INTERFACE_TOKEN_BLOG_SERVICE);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('createBlog', () => {
    const entity = createRandomBlogEntity();
    it('should create a new blog', async () => {
      // Arrange
      service.create.mockResolvedValue(entity);

      // Act
      const call = async () => {
        return await sut.create(request, {
          title: entity.title,
          subtitle: entity.subtitle,
          content: entity.content,
        });
      };
      // Assert
      await expect(call()).resolves.toStrictEqual(entity);
    });
    it('should rethrow unexpected errors', async () => {
      // Arrange
      service.create.mockRejectedValue(new Error('Mock Error'));

      // Act
      const call = async () => {
        return await sut.create(request, {
          title: entity.title,
          subtitle: entity.subtitle,
          content: entity.content,
        });
      };

      // Assert
      await expect(call()).rejects.toThrow(Error);
    });
  });

  describe('addBlogImage', () => {
    it('should return 404', async () => {
      // Arrange
      service.update.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        const file: any = {};
        return await sut.uploadImage(
          request,
          { id: faker.string.uuid() },
          file,
        );
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getting all blogs', () => {
    it('should return 404', async () => {
      // Arrange
      service.getAll.mockResolvedValue([]);

      // Act
      const call = async () => {
        return await sut.getAll(request);
      };
      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
    it('should return all blogs', async () => {
      // Arrange
      const blogs: Blog[] = [
        {
          id: 'some-id',
          subtitle: 'subtitle',
          content: 'test-description',
          userId: 'some-id',
          title: 'some-title',
          image: null,
          deletedAt: null,
        },
      ];
      service.getAll.mockResolvedValue(Promise.resolve(blogs));
      // Act
      const call = async () => {
        return await sut.getAll(request);
      };
      // Assert
      await expect(call()).resolves.toBe(blogs);
    });
    it('should rethrow unexpected errors', async () => {
      // Arrange
      service.getAll.mockRejectedValue(new Error('Mock Error'));

      // Act
      const call = async () => {
        return await sut.getAll(request);
      };

      // Assert
      await expect(call()).rejects.toThrow(Error);
    });
  });

  describe('get blog by id', () => {
    it('should return 404', async () =>
      // Arrange
      {
        service.get.mockRejectedValue(new NotFoundException());

        // Act
        const call = async () => {
          return await sut.get(request, { id: faker.string.uuid() });
        };

        // Assert
        await expect(call()).rejects.toThrow(NotFoundException);
      });

    it('should return blog', async () => {
      // Arrange
      const blog: Blog = createRandomBlogEntity();
      service.get.mockResolvedValue(Promise.resolve(blog));
      // Act
      const call = async () => {
        return await sut.get(request, { id: faker.string.uuid() });
      };
      // Assert
      await expect(call()).resolves.toStrictEqual(blog);
    });
    it('should rethrow unexpected errors', async () => {
      // Arrange
      service.get.mockRejectedValue(new Error('Mock Error'));

      // Act
      const call = async () => {
        return await sut.get(request, { id: faker.string.uuid() });
      };

      // Assert
      await expect(call()).rejects.toThrow(Error);
    });
  });

  describe('updateBlog', () => {
    it('should rethrow unexpected errors', async () => {
      // Arrange
      service.update.mockRejectedValue(new Error('Mock Error'));

      // Act
      const call = async () => {
        return await sut.update(
          request,
          { id: faker.string.uuid() },
          { title: faker.word.words(5), content: faker.word.words(50) },
        );
      };

      // Assert
      await expect(call()).rejects.toThrow(Error);
    });
  });

  describe('deleteBog', () => {
    it('should return 404', async () => {
      // Arrange
      service.softDelete.mockRejectedValue(new NotFoundException());

      // Act
      const call = async () => {
        return await sut.delete(request, { id: faker.string.uuid() });
      };

      // Assert
      await expect(call()).rejects.toThrow(NotFoundException);
    });
  });
});
