import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogSchema } from './entities/blog.schema';
import { BlogsRepository } from './blogs.repository';
import { INTERFACE_TOKEN_BLOG_REPOSITORY } from './interfaces/blogs.interface.repository';
import { INTERFACE_TOKEN_BLOG_SERVICE } from './interfaces/blogs.interface.service';
import { CommonModule } from '@src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogSchema]), CommonModule],
  controllers: [BlogsController],
  providers: [
    { provide: INTERFACE_TOKEN_BLOG_SERVICE, useClass: BlogsService },
    { provide: INTERFACE_TOKEN_BLOG_REPOSITORY, useClass: BlogsRepository },
  ],
})
export class BlogsModule {}
