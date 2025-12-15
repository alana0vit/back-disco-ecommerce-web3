import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnderecoDto {
  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  @IsString()
  @IsNotEmpty()
  rua: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'Recife',
  })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({
    description: 'Número da residência',
    example: 123,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  numCasa: number;

  @ApiProperty({
    description: 'Complemento (opcional)',
    example: 'Apto 201, Bloco B',
    required: false,
  })
  @IsString()
  @IsOptional()
  complemento?: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'PE',
  })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({
    description: 'CEP',
    example: '50000-000',
  })
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty({
    description: 'Indica se este é o endereço padrão',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  padrao: boolean;
}
