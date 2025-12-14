import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import type { StringValue } from 'ms';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || '',
        signOptions: { expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN') },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, EmailService],
  controllers: [AuthController],
})
export class AuthModule {}