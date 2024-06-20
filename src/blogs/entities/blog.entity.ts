export class Blog {
  id: string;
  title: string;
  content: string;
  userId: string;
  image: string | null = null;
  deletedAt: Date | null = null;
}
