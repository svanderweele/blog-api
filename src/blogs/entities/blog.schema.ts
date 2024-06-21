import { EntitySchema } from 'typeorm';
import { Blog } from './blog.entity';

export const BlogSchema = new EntitySchema<Blog>({
  name: 'Blog',
  target: Blog,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: 'text',
    },
    subtitle: {
      type: 'text',
    },
    content: {
      type: 'text',
    },
    image: {
      type: 'text',
      nullable: true,
    },
    deletedAt: {
      type: 'date',
      deleteDate: true,
    },
    userId: {
      type: 'uuid',
    },
  },
});
