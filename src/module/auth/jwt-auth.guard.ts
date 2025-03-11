import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    return super.canActivate(context); 
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
    return user;
  }
}
