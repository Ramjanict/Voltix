import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'User with this email already exists or invalid data' })
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and set authentication cookie' })
  @ApiResponse({ status: 200, description: 'Login successful, returns user info and sets token cookie' })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(dto, res);
  }

  @Get('user-logout')
  @ApiOperation({ summary: 'Logout user and clear session cookie' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('user-details')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserDetails(@CurrentUser('id') userId: string) {
    return this.authService.getCurrentUser(userId);
  }
}
