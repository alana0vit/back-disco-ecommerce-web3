import { Injectable } from '@nestjs/common';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';

@Injectable()
export class ItemPedidoService {
  create(createItemPedidoDto: CreateItemPedidoDto) {
    return 'This action adds a new itemPedido';
  }

  findAll() {
    return `This action returns all itemPedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemPedido`;
  }

  update(id: number, updateItemPedidoDto: UpdateItemPedidoDto) {
    return `This action updates a #${id} itemPedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemPedido`;
  }
}
