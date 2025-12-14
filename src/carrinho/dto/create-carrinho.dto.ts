import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCarrinhoDto {
  @ApiProperty({ description: 'ID do cliente dono do carrinho', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_cliente: number;
}
