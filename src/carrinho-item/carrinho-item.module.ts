import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrinhoItem } from './entities/carrinho-item.entity';
import { CarrinhoItemController } from './carrinho-item.controller';
import { CarrinhoService } from 'src/carrinho/carrinho.service';
import { CarrinhoModule } from '../carrinho/carrinho.module';
import { ProdutoModule } from '../produto/produto.module';
import { CarrinhoItemService } from './carrinho-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarrinhoItem]), CarrinhoModule, ProdutoModule
  ],
  controllers: [CarrinhoItemController],
  providers: [CarrinhoItemService],
  exports: [CarrinhoItemService],
})
export class CarrinhoItemModule { }
