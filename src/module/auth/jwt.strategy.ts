import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      ignoreExpiration: false, // Không bỏ qua kiểm tra hạn token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your_secret_key',
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
