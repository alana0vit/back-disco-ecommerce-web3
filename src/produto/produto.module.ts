import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Pagamento } from 'src/pagamento/entities/pagamento.entity';
import { Imagem } from 'src/imagemProduto/entities/imagem.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { ReservaEstoqueService } from './reserva-estoque.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LimpezaReservasCronService } from './limpeza-reservas-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto, Categoria, Pagamento, Imagem, Pedido]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ProdutoController],
  providers: [
    ProdutoService,
    ReservaEstoqueService,
    LimpezaReservasCronService,
  ],
  exports: [ReservaEstoqueService, LimpezaReservasCronService, ProdutoService, TypeOrmModule],
})
export class ProdutoModule {}
