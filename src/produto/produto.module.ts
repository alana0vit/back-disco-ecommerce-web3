import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Pagamento } from 'src/pagamento/entities/pagamento.entity';
import { Imagem } from 'src/imagemProduto/entities/imagem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Categoria, Pagamento,Imagem])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
