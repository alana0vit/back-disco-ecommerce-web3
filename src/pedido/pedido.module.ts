import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Endereco } from 'src/endereco/entities/endereco.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { ItemPedido } from 'src/item-pedido/entities/item-pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, Endereco, Cliente, Produto, ItemPedido]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
