import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/loginUser.dto';
import { RegisterDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterDto) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });
    const payload = { sub: user._id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }
}
