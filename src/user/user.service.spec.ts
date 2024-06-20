import { UserService } from './user.service';
import { TestBed } from '@automock/jest';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const { unit } = TestBed.create(UserService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
