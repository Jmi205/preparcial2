import { AppointmentEntity } from 'src/appointment/appointment.entity/appointment.entity';
import { RoleEntity } from 'src/role/role.entity/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.paciente)
  appointments: AppointmentEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  doctorAppointments: AppointmentEntity[];
}
