import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request.cookies?.token ||
      request.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Please login with valid details...!');
    }

    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') ||
        this.configService.get<string>('TOKEN_SECRET_KEY');
      const decoded = await this.jwtService.verifyAsync(token, { secret });
      request.user = decoded;
      request.userId = decoded._id || decoded.id;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Authentication failed or token expired');
    }
  }
}
