import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCarrinhoItemDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id_produto: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantidade: number;
}
