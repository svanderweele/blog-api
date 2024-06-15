import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogSchema } from './entities/blog.schema';
import { BlogsRepository } from './blogs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogSchema])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {}
