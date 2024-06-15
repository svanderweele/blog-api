export type BlogServiceErrors = 'blog_not_found';

export class BlogServiceError extends Error {
  code: BlogServiceErrors;

  constructor(code: BlogServiceErrors, message?: string) {
    super(message);
    this.code = code;
  }
}

export class BlogNotFoundServiceError extends BlogServiceError {
  constructor() {
    super('blog_not_found', 'Blog not found');
  }
}

export type BlogRepositoryErrors = 'unexpected_error' | 'blog_not_found';

export class BlogRepositoryError extends Error {
  code: BlogRepositoryErrors;

  constructor(code: BlogRepositoryErrors, message: string) {
    super(message);
    this.code = code;
  }
}

export class BlogNotFoundRepositoryError extends BlogRepositoryError {
  constructor() {
    super('blog_not_found', 'Blog not found');
  }
}
