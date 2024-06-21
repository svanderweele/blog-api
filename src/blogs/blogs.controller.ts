import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { IdDto } from '@src/common/id.dto';
import {
  IBlogService,
  INTERFACE_TOKEN_BLOG_SERVICE,
} from './interfaces/blogs.interface.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ILogger } from '@src/common/logger/logger.interface';
import { INTERFACE_TOKEN_LOGGER_SERVICE } from '@src/common/logger/logger.service';
import { AuthenticatedRequest } from '@src/common/request';
import { Roles } from '@src/auth/decorator/roles.decorator';
import { Role } from '@src/auth/enums/role.enum';

@Controller({
  version: '1',
  path: 'blogs',
})
export class BlogsController {
  constructor(
    @Inject(INTERFACE_TOKEN_BLOG_SERVICE)
    private readonly blogsService: IBlogService,
    @Inject(INTERFACE_TOKEN_LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateBlogDto,
  ): Promise<Blog> {
    this.logger.trace('[blogs.controller.create]', dto);

    return await this.blogsService.create({
      title: dto.title,
      content: dto.content,
      userId: req.user.sub,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './client/',
      }),
    }),
  )
  async uploadImage(
    @Request() req: AuthenticatedRequest,
    @Param() dto: IdDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp('png|jpeg'),
        })
        .addMaxSizeValidator({
          //20 mb
          maxSize: 20971520,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    this.logger.trace('[blogs.controller.uploadImage]', {
      blogId: dto.id,
      file,
    });
    const path = file.filename;

    const blog = await this.blogsService.get(dto.id, req.user.sub);
    if (!blog) {
      throw new NotFoundException();
    }

    await this.blogsService.update(blog, {
      image: path,
    });
  }

  @Patch(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param() dto: IdDto,
    @Body() body: UpdateBlogDto,
  ): Promise<Blog> {
    this.logger.trace('[blogs.controller.update]', { blogId: dto.id, body });
    const blog = await this.blogsService.get(dto.id, req.user.sub);
    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.userId != req.user.sub) {
      throw new NotFoundException();
    }

    return await this.blogsService.update(blog, {
      title: body.title,
      content: body.content,
    });
  }

  @Get()
  @Roles(Role.User)
  async getAll(@Request() req: AuthenticatedRequest) {
    this.logger.trace('[blogs.controller.getAll]');
    const blogs = await this.blogsService.getAll({ userId: req.user.sub });

    if (blogs.length == 0) {
      throw new NotFoundException();
    }

    return blogs;
  }

  @Get('admin')
  @Roles(Role.Admin)
  async getAllAdmin() {
    this.logger.trace('[blogs.controller.getAllAdmin]');
    const blogs = await this.blogsService.getAll({ userId: null });

    if (blogs.length == 0) {
      throw new NotFoundException();
    }

    return blogs;
  }

  @Get(':id')
  async get(@Request() req: AuthenticatedRequest, @Param() dto: IdDto) {
    this.logger.trace('[blogs.controller.get]', dto.id);
    return await this.blogsService.get(dto.id, req.user.sub);
  }

  @Get(':id/image')
  async getImage(@Request() req: AuthenticatedRequest, @Param() dto: IdDto) {
    this.logger.trace('[blogs.controller.getImage]', dto.id);
    const blog = await this.blogsService.get(dto.id, req.user.sub);
    if (!blog) {
      throw new NotFoundException();
    }

    return this.blogsService.getImage(blog);
  }

  @Delete(':id')
  async delete(@Request() req: AuthenticatedRequest, @Param() dto: IdDto) {
    this.logger.trace('[blogs.controller.delete]', dto.id);
    const blog = await this.blogsService.get(dto.id, req.user.sub);
    if (!blog) {
      throw new NotFoundException();
    }

    return this.blogsService.softDelete(blog);
  }
}
