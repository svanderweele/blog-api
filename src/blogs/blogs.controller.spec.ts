// noinspection DuplicatedCode
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TestBed } from '@automock/jest';
import { Blog } from './entities/blog.entity';
import { NotFoundException } from '@nestjs/common';
import { GetBlogDto } from './dto/get-blog.dto';
import { faker } from '@faker-js/faker';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogNotFoundServiceError } from './blogs.errors';

const createRandomBlogEntity = (): Blog => {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(),
    content: faker.word.words({ count: 50 }),
    authorId: faker.string.uuid(),
    image: null,
    deletedAt: null,
  };
};

describe('BlogsController', () => {
  let sut: BlogsController;
  let service: jest.Mocked<BlogsService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(BlogsController).compile();

    sut = unit;
    service = unitRef.get(BlogsService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('createBlog', () => {
    const entity = createRandomBlogEntity();
    it('should create a new blog', async () => {
      const dto: GetBlogDto = {
        ...entity,
      };
      service.create.mockResolvedValue(dto);

      await expect(sut.create(dto)).resolves.toStrictEqual(entity);
    });
  });

  describe('addBlogImage', () => {
    const entity = createRandomBlogEntity();

    it('should return 404', async () => {
      const error = new BlogNotFoundServiceError();
      service.update.mockRejectedValue(error);
      const file: any = {};
      await expect(sut.uploadImage(entity.id, file)).rejects.toStrictEqual(
        new NotFoundException('Blog not found'),
      );
    });
  });

  describe('getting all blogs', () => {
    it('should return 404', async () => {
      service.getAll.mockResolvedValue([]);
      await expect(sut.getAll()).rejects.toThrow(
        new NotFoundException('Not Found'),
      );
    });

    it('should return all blogs', async () => {
      const blogs: Blog[] = [
        {
          id: 'some-id',
          content: 'test-description',
          authorId: 'some-id',
          title: 'some-title',
          image: null,
          deletedAt: null,
        },
      ];
      service.getAll.mockResolvedValue(Promise.resolve(blogs));
      const response = await sut.getAll();
      return response == blogs;
    });
  });

  describe('get blog by id', () => {
    it('should return 404', async () => {
      service.get.mockRejectedValue(new BlogNotFoundServiceError());
      await expect(sut.get(faker.string.uuid())).rejects.toThrow(
        new NotFoundException('Blog not found'),
      );
    });

    it('should return blog', async () => {
      const blog: Blog = createRandomBlogEntity();
      service.get.mockResolvedValue(Promise.resolve(blog));
      await expect(sut.get(faker.string.uuid())).resolves.toStrictEqual(blog);
    });
  });

  describe('updateBlog', () => {
    const entity = createRandomBlogEntity();

    it('should return 404', async () => {
      const error = new BlogNotFoundServiceError();
      service.update.mockRejectedValue(error);
      const dto: UpdateBlogDto = {
        ...entity,
      };

      await expect(sut.update(entity.id, dto)).rejects.toStrictEqual(
        new NotFoundException('Blog not found'),
      );
    });
  });

  describe('deleteBog', () => {
    const entity = createRandomBlogEntity();

    it('should return 404', async () => {
      const error = new BlogNotFoundServiceError();
      service.remove.mockRejectedValue(error);
      await expect(sut.remove(entity.id)).rejects.toStrictEqual(
        new NotFoundException('Blog not found'),
      );
    });
  });
});
