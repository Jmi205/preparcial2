import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AppointmentService } from './appointment.service';
import { Roles } from 'src/auth/roles.decorator';

@Controller('appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles('paciente', 'doctor', 'admin')
  @Post(':id')
  async createAppointment(@Param('id') email: string, @Req() req: any) {
    return await this.appointmentService.createAppointment(
      new Date(),
      email,
      req.user.email,
    );
  }

  @Roles('paciente', 'doctor', 'admin')
  @Get(':id')
  async getAppointments(@Param('id') email: string) {
    return await this.appointmentService.getAppointmentsForUser(email);
  }
  
  @Roles('paciente', 'doctor', 'admin')
  @Put(':id')
  async deleteAppointment(@Param('id') id: string) {
    return await this.appointmentService.deleteAppointment(id);
  }
  
  @Roles('paciente', 'doctor', 'admin')
  @Delete(':id')
  async removeAppointment(@Param('id') id: string) {
    return await this.appointmentService.deleteAppointment(id);
  }

  
}
