import { Module } from '@nestjs/common';
import { ItemPedidoService } from './item-pedido.service';
import { ItemPedidoController } from './item-pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPedido } from './entities/item-pedido.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemPedido, Pedido, Produto])],
  controllers: [ItemPedidoController],
  providers: [ItemPedidoService],
})
export class ItemPedidoModule {}
