import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginUser.dto';
import { RegisterDto } from './dto/registerUser.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    const token = await this.authService.registerUser(registerUserDto);
    return token;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.loginUser(loginDto);
    return token;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub;
    const user = await this.userService.getUserById(userId);
    return {
      id: user?.id,
      email: user?.email,
      username: user?.username,
      role: user?.role,
    };
  }
}
