import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleService } from './role.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreateRoleDto } from 'src/auth/dto/createRol.dto';

@Controller('role')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Post()
  @Roles('admin')
  async createRole(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.createRole(dto);
    return {
      message: 'Rol creado con éxito',
      roleId: role.id,
    };
  }

  @Get()
  @Roles('admin')
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }
}
