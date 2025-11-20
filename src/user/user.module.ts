import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { RoleEntity } from 'src/role/role.entity/role.entity';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
})
export class UserModule {}
