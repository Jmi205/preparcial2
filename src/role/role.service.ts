import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from 'src/auth/dto/createRol.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(dto: CreateRoleDto): Promise<RoleEntity> {
    const exist = await this.roleRepository.findOne({
      where: { role_name: dto.role_name },
    });
    if (exist) {
      throw new Error('role_name ya existe');
    }

    const role = this.roleRepository.create({
      role_name: dto.role_name,
      description: dto.description,
    });
    return await this.roleRepository.save(role);
  }

  async getAllRoles(): Promise<RoleEntity[]> {
    try {
      return await this.roleRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }
}
