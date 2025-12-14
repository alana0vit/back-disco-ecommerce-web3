import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Email do usuário que esqueceu a senha',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}