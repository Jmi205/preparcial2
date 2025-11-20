import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { In, Repository } from 'typeorm';
import { RoleEntity } from 'src/role/role.entity/role.entity';
import { AssignRolesDto } from 'src/auth/dto/assignRoles.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User not found');

    delete (user as any).password;
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (!user) return null;

    delete (user as any).password;
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({ relations: ['roles'] });
    users.forEach((user) => delete (user as any).password);
    return users;
  }

  async assignRolesToUser(userId: string, dto: AssignRolesDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const roles = await this.roleRepository.find({
      where: dto.roles.map((name) => ({ role_name: name })),
    });

    user.roles = roles;

    await this.userRepository.save(user);

    return { message: 'Roles asignados' };
  }

  async createUser(
    email: string,
    password: string,
    name?: string,
    phone?: string,
    roles?: string[],
  ): Promise<UserEntity> {
    let rolesNew: RoleEntity[] = [];
    if (roles && roles.length > 0) {
      rolesNew = await this.roleRepository.findBy({ role_name: In(roles) });
    }

    const user = this.userRepository.create({
      email,
      password,
      name,
      phone,
      roles: rolesNew,
    });

    const saved = await this.userRepository.save(user);
    delete (saved as any).password;
    return saved;
  }
}
