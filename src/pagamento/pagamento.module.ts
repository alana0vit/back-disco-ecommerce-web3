import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { PedidoModule } from 'src/pedido/pedido.module';
import { ProdutoModule } from 'src/produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagamento, Pedido, Produto]),
    PedidoModule,
    ProdutoModule,
  ],
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService],
})
export class PagamentoModule {}
