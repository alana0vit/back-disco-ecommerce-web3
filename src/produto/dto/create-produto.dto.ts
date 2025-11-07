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

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  preco: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  estoque: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id_categoria_prod: number;

  @IsBoolean()
  @IsOptional()
  ativo: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsString()
  imagem?: string;
}
