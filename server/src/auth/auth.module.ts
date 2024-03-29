import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshAccessToken } from './strategies/refreshToken.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService,AccessTokenStrategy,RefreshAccessToken],
})
export class AuthModule {}
