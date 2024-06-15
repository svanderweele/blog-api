export class Blog {
  id: string;
  title: string;
  description: string;
  authorId: string;
  image: string | null = null;
  deletedAt: Date | null = null;
}
