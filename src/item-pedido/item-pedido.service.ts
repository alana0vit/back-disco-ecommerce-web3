import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { ItemPedido } from './entities/item-pedido.entity';
import { Repository } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';

@Injectable()
export class ItemPedidoService {
  constructor(
    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

  async create(createItemPedidoDto: CreateItemPedidoDto): Promise<ItemPedido> {
    const produto = await this.produtoRepository.findOne({
      where: { idProduto: createItemPedidoDto.id_produto_itpdd },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido: createItemPedidoDto.id_pedido_itpdd },
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    const valorUnitario = Number(
      produto.preco ?? createItemPedidoDto.valorUnitario ?? 0,
    );
    const valorTotal = createItemPedidoDto.quantidade * valorUnitario;
    const itemPedido = this.itemPedidoRepository.create({
      quantidade: createItemPedidoDto.quantidade,
      valorUnitario,
      valorTotal,
      produto,
      pedido,
    });
    return await this.itemPedidoRepository.save(itemPedido);
  }

  async findAll(): Promise<ItemPedido[]> {
    return await this.itemPedidoRepository.find({
      relations: ['produto', 'pedido'],
    });
  }

  async findOne(id: number): Promise<ItemPedido> {
    const itemPedido = await this.itemPedidoRepository.findOne({
      where: { idItem: id },
      relations: ['produto', 'pedido'],
    });
    if (!itemPedido) {
      throw new NotFoundException(`Item não encontrado!`);
    }
    return itemPedido;
  }

  async update(
    id: number,
    updateItemPedidoDto: UpdateItemPedidoDto,
  ): Promise<ItemPedido> {
    const item = await this.findOne(id);
    if (updateItemPedidoDto.quantidade)
      item.quantidade = updateItemPedidoDto.quantidade;
    if (updateItemPedidoDto.valorUnitario)
      item.valorUnitario = updateItemPedidoDto.valorUnitario;
    item.valorTotal = item.quantidade * item.valorUnitario;
    return await this.itemPedidoRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const itemPedido = await this.findOne(id);
    await this.itemPedidoRepository.remove(itemPedido);
  }
}