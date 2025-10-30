import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dataNasc: Date;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
