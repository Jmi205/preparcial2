import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.email) {
      throw new Error('Email invalido');
    }

    const exists = await this.userService.findByEmail(dto.email);
    if (exists) {
      throw new Error('Email ya registrado');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser(
      dto.email,
      hashed,
      dto.name,
      dto.phone,
    );

    return {
      message: 'Usuario registrado con éxito',
      userId: user.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (!user.is_active) throw new HttpException('Usuario desactivado', 423);

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
