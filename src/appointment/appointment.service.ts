import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity/user.entity';
import { AppointmentEntity, AppointmentStatus } from './appointment.entity/appointment.entity';
import { Repository } from 'typeorm';
import { App } from 'supertest/types';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}
  
  async createAppointment(
    date: Date,
    emailPaciente: string,
    emailDoctor: string,
  ): Promise<AppointmentEntity> {
    const paciente = await this.userRepository.findOne({
      where: { email: emailPaciente },
    });
    const doctor = await this.userRepository.findOne({
      where: { email: emailDoctor },
    });
    if (!paciente || !doctor) {
      throw new Error('Paciente o doctor no encontrado');
    }

    const appointment = this.appointmentRepository.create({
      datetme: date,
      status: AppointmentStatus.PENDING,
      paciente,
      doctor,
    });

    return await this.appointmentRepository.save(appointment);
  }

  async getAppointmentsForUser(email: string): Promise<AppointmentEntity[]> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.roles.some((role) => role.role_name === 'admin')) {
      return await this.appointmentRepository.find();
    } else if (user.roles.some((role) => role.role_name === 'doctor')) {
      return await this.appointmentRepository.find({
        where: { doctor: { id: user.id }, paciente: { id: user.id } },
        relations: ['paciente', 'doctor'],
      });
    } else {
      return await this.appointmentRepository.find({
        where: { paciente: { id: user.id } },
        relations: ['paciente', 'doctor'],
      });
    }
  }

 async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }
    if (appointment.status !== AppointmentStatus.PENDING) {
        throw new Error('Solo se pueden actualizar citas pendientes');
    }
    appointment.status = status;
    return await this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(appointmentId: string): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new Error('Cita no encontrada');
    }
    await this.appointmentRepository.remove(appointment);
    return appointment;
  }
}
