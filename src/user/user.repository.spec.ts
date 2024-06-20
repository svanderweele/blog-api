import { UserRepository } from './user.repository';
import { TestBed } from '@automock/jest';

describe('UserService', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const { unit } = TestBed.create(UserRepository).compile();

    repository = unit;
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
