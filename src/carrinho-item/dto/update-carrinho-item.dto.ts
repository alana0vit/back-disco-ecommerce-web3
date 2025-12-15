import { PartialType } from '@nestjs/swagger';
import { CreateCarrinhoItemDto } from './create-carrinho-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCarrinhoItemDto extends PartialType(CreateCarrinhoItemDto) {
  @ApiProperty({ description: 'Quantidade atualizada do item', example: 2 })
  @IsInt()
  @Min(1)
  quantidade: number;
}
