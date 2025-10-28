import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEnderecoDto {
  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsNumber()
  @IsNotEmpty()
  numCasa: number;

  @IsString()
  @IsOptional()
  complemento: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsBoolean()
  @IsNotEmpty()
  padrao: boolean;
}
