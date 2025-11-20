import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    const userRoles = user.roles?.map((r) => r.role_name) || [];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) throw new ForbiddenException('No autorizado');

    return true;
  }
}
