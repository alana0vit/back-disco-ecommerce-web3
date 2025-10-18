import { Module } from '@nestjs/common';
import { ItemPedidoService } from './item-pedido.service';
import { ItemPedidoController } from './item-pedido.controller';

@Module({
  controllers: [ItemPedidoController],
  providers: [ItemPedidoService],
})
export class ItemPedidoModule {}
