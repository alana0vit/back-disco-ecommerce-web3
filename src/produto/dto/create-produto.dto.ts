import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  descricao: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estoque: number;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsBoolean()
  @IsNotEmpty()
  statusProduto: boolean;

  @IsOptional()
  @IsString()
  imagem: string;
}
