import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Bắt buộc kiểm tra hạn token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your_secret_key',
    });
  }

  async validate(payload: any) {

    if (!payload || payload.exp * 1000 < Date.now()) {
      throw new UnauthorizedException('Token đã hết hạn');
    }

    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
