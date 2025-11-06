import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Endereco } from 'src/endereco/entities/endereco.entity';
import { ItemPedido } from 'src/item-pedido/entities/item-pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: createPedidoDto.id_cliente },
    });
    const endereco = await this.enderecoRepository.findOne({
      where: { idEndereco: createPedidoDto.id_endereco },
    });
    if (!cliente || !endereco) {
      throw new NotFoundException('Cliente ou endereço inválido.');
    }
    const itens: ItemPedido[] = [];
    let valorTotal = 0;
    let qtdTotal = 0;
    for (const itemDto of createPedidoDto.item_pedidos) {
      const produto = await this.produtoRepository.findOne({
        where: { idProduto: itemDto.id_produto_itpdd },
      });
      if (!produto) throw new NotFoundException('Produto não encontrado.');
      if (produto.estoque < itemDto.quantidade)
        throw new BadRequestException(
          `Estoque insuficiente para o produto: ${produto.nome}`,
        );
      const valorUnitario = produto.preco;
      const valorItem = valorUnitario * itemDto.quantidade;
      valorTotal += valorItem;
      qtdTotal += itemDto.quantidade;

      itens.push(
        this.itemPedidoRepository.create({
          produto,
          quantidade: itemDto.quantidade,
          valorUnitario,
          valorTotal: valorItem,
        }),
      );
    }
    const pedido = this.pedidoRepository.create({
      cliente,
      endereco,
      itemPedidos: itens,
      valorTotal,
      qtdTotal,
    });
    return await this.pedidoRepository.save(pedido);
  }

  async findAllByCliente(idCliente: number): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      where: { cliente: { idCliente } },
      relations: ['cliente', 'itemPedidos', 'pagamento', 'endereco'],
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOneBy({
      idPedido: id,
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido não encontrado!`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido: id },
      relations: ['itemPedidos', 'pagamento', 'cliente', 'endereco'],
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado!');
    }
    if (pedido.statusPedido === 'Pago') {
      throw new Error('Não é possível editar um pedido já pago.');
    }
    Object.assign(pedido, updatePedidoDto);
    if (
      updatePedidoDto.item_pedidos &&
      updatePedidoDto.item_pedidos.length > 0
    ) {
      let novoTotal = 0;
      let novaQtd = 0;
      for (const item of updatePedidoDto.item_pedidos) {
        const subtotal = item.quantidade * item.valorUnitario;
        novoTotal += subtotal;
        novaQtd += item.quantidade;
      }
      pedido.valorTotal = novoTotal;
      pedido.qtdTotal = novaQtd;
    }
    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    if (pedido.pagamento && pedido.pagamento.statusPag === 'Pago') {
      throw new BadRequestException('Pedido pago não pode ser alterado ou removido.');
    }
    await this.pedidoRepository.remove(pedido);
  }
}