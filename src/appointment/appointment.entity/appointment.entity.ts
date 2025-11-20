import { UserEntity } from 'src/user/user.entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  datetme: Date;

  @Column()
  status: AppointmentStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.appointments)
  paciente: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.doctorAppointments)
  doctor: UserEntity;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  DONE = 'done',
  CANCELLED = 'cancelled',
}
