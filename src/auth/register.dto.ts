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

export enum Role {
  Cliente = 'CLIENTE',
  Admin = 'ADMIN',
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    senha: string;

    @IsOptional()
    @IsString()
    telefone?: string;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    dataNasc: string;
}