import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './appointment.entity/appointment.entity';
import { UserEntity } from 'src/user/user.entity/user.entity';

@Module({
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
  imports: [TypeOrmModule.forFeature([AppointmentEntity, UserEntity])],

})
export class AppointmentModule {}
