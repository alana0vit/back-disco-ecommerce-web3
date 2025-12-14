<<<<<<< HEAD
export class CreateCarrinhoDto {}
=======
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCarrinhoDto {
  @ApiProperty({ description: 'ID do cliente dono do carrinho', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_cliente: number;
}
>>>>>>> f176d0075cf5640f5ef0f80e4ce575b37ef547b9
