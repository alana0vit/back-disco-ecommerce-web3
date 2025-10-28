import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  IsDecimal,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  descricao: string;

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

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsBoolean()
  @IsNotEmpty()
  ativo: boolean;

  @IsOptional()
  @IsString()
  imagem: string;
}
