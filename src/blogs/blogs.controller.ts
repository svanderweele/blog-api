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

// For now the system will only support one USER
const USER_UUID = '06cec3d1-e9b7-45bd-bb57-dc0b980c6303';

@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject(INTERFACE_TOKEN_BLOG_SERVICE)
    private readonly blogsService: IBlogService,
  ) {}

  @Post()
  async create(@Body() dto: CreateBlogDto): Promise<Blog> {
    return await this.blogsService.create({
      title: dto.title,
      content: dto.content,
      authorId: USER_UUID,
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
    @Param('id') blogId: string,
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
    const path = file.filename;
    await this.blogsService.update(blogId, {
      image: path,
    });
  }

  @Patch(':id')
  async update(
    @Param() idDto: IdDto,
    @Body() dto: UpdateBlogDto,
  ): Promise<Blog> {
    return await this.blogsService.update(idDto.id, {
      title: dto.title,
      content: dto.content,
    });
  }

  @Get()
  async getAll() {
    const blogs = await this.blogsService.getAll();

    if (blogs.length == 0) {
      throw new NotFoundException();
    }

    return blogs;
  }

  @Get(':id')
  async get(@Param() dto: IdDto) {
    return await this.blogsService.get(dto.id);
  }

  @Get(':id/image')
  async getImage(@Param() dto: IdDto) {
    return this.blogsService.getImage(dto.id);
  }

  @Delete(':id')
  async delete(@Param() dto: IdDto) {
    return this.blogsService.softDelete(dto.id);
  }
}
