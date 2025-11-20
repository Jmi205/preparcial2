import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssignRolesDto } from 'src/auth/dto/assignRoles.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Req() req: any) {
    const user = await this.userService.findById(req.user.id);
    return user;
  }

  @Roles('admin')
  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Roles('admin')
  @Patch(':id/roles')
  async asignRolesToUser(@Param('id') id: string, @Body() dto: AssignRolesDto) {
    return await this.userService.assignRolesToUser(id, dto);
  }



}
