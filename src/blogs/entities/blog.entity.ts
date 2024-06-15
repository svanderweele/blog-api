export class Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  image: string | null = null;
  deletedAt: Date | null = null;
}
