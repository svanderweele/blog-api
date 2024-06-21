import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './entity/user.schema';
import { UserRepository } from '@src/user/user.repository';
import { CommonModule } from '@src/common/common.module';
import { INTERFACE_TOKEN_USER_SERVICE } from './interfaces/user.service.interface';
import { INTERFACE_TOKEN_USER_REPOSITORY } from './interfaces/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema]), CommonModule],
  providers: [
    UserService,
    { provide: INTERFACE_TOKEN_USER_SERVICE, useClass: UserService },
    { provide: INTERFACE_TOKEN_USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [
    { provide: INTERFACE_TOKEN_USER_SERVICE, useClass: UserService },
    { provide: INTERFACE_TOKEN_USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class UserModule {}
