import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { BlogNotFoundServiceError } from './blogs.errors';
import { createReadStream } from 'fs';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    try {
      return this.blogsService.create(createBlogDto);
    } catch (error) {
      //log failure
      throw error;
    }
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string) {
    const blog = await this.blogsService.get(id);

    if (!blog.image) {
      throw new NotFoundException('Blog image not found.');
    }

    const filePath = join(process.cwd(), 'client', blog.image);
    const file = createReadStream(filePath);
    return new StreamableFile(file);
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
    try {
      await this.blogsService.update(blogId, {
        image: path,
      });
    } catch (error) {
      if (error instanceof BlogNotFoundServiceError) {
        throw new NotFoundException('Blog not found');
      }
    }
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
  async get(@Param('id') id: string) {
    try {
      return await this.blogsService.get(id);
    } catch (error) {
      if (error instanceof BlogNotFoundServiceError) {
        throw new NotFoundException('Blog not found');
      }
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    //TODO: add caching
    try {
      await this.blogsService.update(id, updateBlogDto);
    } catch (error) {
      if (error instanceof BlogNotFoundServiceError) {
        throw new NotFoundException('Blog not found');
      }
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.blogsService.remove(id);
    } catch (error) {
      if (error instanceof BlogNotFoundServiceError) {
        throw new NotFoundException('Blog not found');
      }
    }
  }
}
