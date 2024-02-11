import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  //Signup
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    //Check if user exists
    const userExists = await this.userService.findByEmail(createUserDto.email);
    if (userExists) throw new BadRequestException('User already exists');

    //Hash Password
    const hash = await this.hashData(createUserDto.password);

    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
    });
    //Access & refresh Tokens
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  //Signin
  async signIn(data: CreateAuthDto) {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    //Check if user exists
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');

    //check pass
    const passwordMarches = await argon2.verify(user.password, data.password);
    if (!passwordMarches) throw new BadRequestException('Wrong Password');

    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  //Logout
  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }
}
