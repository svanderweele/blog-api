import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { CommonModule } from '@src/common/common.module';
import { AppModule } from '@src/app.module';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CommonModule],
      controllers: [MailController],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
