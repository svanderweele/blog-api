import { AuthController } from './auth.controller';
import { TestBed } from '@automock/jest';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const { unit } = TestBed.create(AuthController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
