import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrinhoItem } from './entities/carrinho-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarrinhoItem])],
})
export class CarrinhoItemModule {}
