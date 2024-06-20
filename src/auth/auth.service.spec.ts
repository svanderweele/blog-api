import { AuthService } from './auth.service';
import { TestBed } from '@automock/jest';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const { unit } = TestBed.create(AuthService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
