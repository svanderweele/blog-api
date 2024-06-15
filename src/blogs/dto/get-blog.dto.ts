export class GetBlogDto {
  id: string;
  title: string;
  content: string;
  image?: string | null = null;
  deletedAt?: Date | null = null;
}
