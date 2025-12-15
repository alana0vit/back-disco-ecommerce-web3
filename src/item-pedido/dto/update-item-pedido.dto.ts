import { PartialType } from '@nestjs/swagger';
import { CreateItemPedidoDto } from './create-item-pedido.dto';

export class UpdateItemPedidoDto extends PartialType(CreateItemPedidoDto) {}
