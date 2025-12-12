import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Metodo, StatusPag } from '../entities/pagamento.entity';

export class CreatePagamentoDto {
  @ApiProperty({ example: 120.5 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({ enum: Metodo, example: Metodo.PIX })
  @IsEnum(Metodo)
  metodoPag: Metodo;

  @ApiPropertyOptional({
    enum: StatusPag,
    example: StatusPag.PENDENTE,
  })
  @IsEnum(StatusPag)
  @IsOptional()
  statusPag?: StatusPag;

  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idPedido: number;
}