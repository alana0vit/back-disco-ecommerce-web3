import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  IsDecimal,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camisa Polo',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Camisa polo masculina tamanho M',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Preço unitário do produto',
    example: 59.9,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  preco: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  estoque: number;

  @ApiProperty({
    description: 'ID da categoria associada ao produto',
    example: 3,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id_categoria_prod: number;

  @ApiPropertyOptional({
    description: 'Indica se o produto está ativo',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  ativo: boolean;
}
