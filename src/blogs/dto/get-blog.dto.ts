export class GetBlogDto {
  id: string;
  title: string;
  description: string;
  image?: string | null = null;
  deletedAt?: Date | null = null;
}
