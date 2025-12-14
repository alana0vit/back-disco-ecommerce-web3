import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCarrinhoDto } from './create-carrinho.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateCarrinhoDto extends PartialType(CreateCarrinhoDto) {
  @ApiPropertyOptional({ description: 'Total do carrinho (geralmente calculado automaticamente)', example: 120.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;
}
