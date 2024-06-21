import { MailController } from './mail.controller';
import { TestBed } from '@automock/jest';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const { unit } = TestBed.create(MailController).compile();

    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
