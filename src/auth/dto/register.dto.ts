import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsDate,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  Cliente = 'CLIENTE',
  Admin = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Maria',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Email válido do usuário',
    example: 'maria@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha de acesso (mínimo 6 caracteres)',
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @ApiProperty({
    description: 'Telefone para contato (opcional)',
    example: '(81) 99999-0000',
    required: false,
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({
    description: 'Indica se o usuário está ativo',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({
    description: 'Perfil do usuário no sistema',
    enum: Role,
    example: Role.Cliente,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    description: 'Data de nascimento do usuário',
    example: '2000-05-20',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dataNasc: string;
}