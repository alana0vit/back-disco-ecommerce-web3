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
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';
import { CarrinhoItem } from 'src/carrinho-item/entities/carrinho-item.entity';
import { Status } from 'src/pedido/entities/pedido.entity';
import { ReservaEstoqueService } from 'src/produto/reserva-estoque.service';

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

    @InjectRepository(Carrinho)
    private readonly carrinhoRepository: Repository<Carrinho>,

    @InjectRepository(CarrinhoItem)
    private readonly carrinhoItemRepository: Repository<CarrinhoItem>,

    private readonly reservaEstoqueService: ReservaEstoqueService, // ← INJETE
  ) { }

  async create(dto: CreatePedidoDto, idCarrinho: number): Promise<Pedido> {
    const { id_carrinho, id_endereco, descricao, statusPedido } = dto;

    const carrinho = await this.carrinhoRepository.findOne({
      where: { idCarrinho },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    if (!carrinho) throw new NotFoundException('Carrinho não encontrado.');

    if (carrinho.itens.length === 0)
      throw new BadRequestException('Carrinho vazio.');

    const endereco = await this.enderecoRepository.findOne({
      where: { idEndereco: id_endereco },
    });

    if (!endereco)
      throw new NotFoundException('Endereço não encontrado.');

    for (const item of carrinho.itens) {
      if (!item.produto.ativo)
        throw new BadRequestException(
          `Produto ${item.produto.nome} está inativo e não pode ser comprado.`,
        );

      const estoqueDisponivel = item.produto.estoque - item.produto.estoqueReservado;
      if (estoqueDisponivel < item.quantidade)
        throw new BadRequestException(
          `Estoque insuficiente para o produto ${item.produto.nome}. ` +
          `Disponível: ${estoqueDisponivel}, Solicitado: ${item.quantidade}`
        );
    }
    const itensPedido = carrinho.itens.map((item) =>
      this.itemPedidoRepository.create({
        produto: item.produto,
        quantidade: item.quantidade,
        valorUnitario: item.produto.preco,
        valorTotal: item.quantidade * item.produto.preco,
        carrinhoItem: item,
      }),
    );

    const valorTotal = itensPedido.reduce((total, item) => total + Number(item.valorTotal), 0);
    const qtdTotal = itensPedido.reduce((total, item) => total + item.quantidade, 0);
    const pedido = this.pedidoRepository.create({
      cliente: carrinho.cliente,
      itemPedidos: itensPedido,
      valorTotal,
      qtdTotal,
      statusPedido: Status.AGUARDANDO,
      carrinho,
      endereco,
      descricao,
    });
    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    try {
      await this.reservaEstoqueService.reservarEstoque(pedidoSalvo);
      carrinho.convertidoEmPedido = true;
      await this.carrinhoRepository.save(carrinho);

      return pedidoSalvo;
    } catch (error) {
      await this.pedidoRepository.remove(pedidoSalvo);
      throw new BadRequestException(
        `Falha ao criar pedido: ${error.message}`
      );
    }
  }

  async findAllByCliente(idCliente: number): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      where: { cliente: { idCliente } },
      relations: ['cliente', 'itemPedidos', 'pagamento', 'endereco'],
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido: id },
      relations: ['itemPedidos', 'cliente', 'carrinho', 'endereco'],
    });

    if (!pedido) throw new NotFoundException('Pedido não encontrado.');
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
    
    if (pedido.statusPedido === Status.PAGO) {
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
    if (!pedido) throw new NotFoundException();
    if (pedido.statusPedido === Status.PAGO)
      throw new BadRequestException('Pedido pago não pode ser removido.');
    await this.reservaEstoqueService.liberarEstoque(pedido.idPedido);
    await this.pedidoRepository.remove(pedido);
  }

  async confirmarPagamento(idPedido: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['itemPedidos', 'itemPedidos.produto', 'pagamento'],
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (pedido.statusPedido === Status.PAGO) {
      throw new BadRequestException('Pedido já está pago');
    }
    if (!pedido.pagamento || pedido.pagamento.statusPag !== 'Pago') {
      throw new BadRequestException('Pagamento não aprovado ou não encontrado');
    }
    await this.reservaEstoqueService.confirmarEstoque(pedido.idPedido);
    pedido.statusPedido = Status.PAGO;
        return await this.pedidoRepository.save(pedido);
  }

  async cancelarPedido(idPedido: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['itemPedidos', 'itemPedidos.produto'],
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (pedido.statusPedido === Status.PAGO) {
      throw new BadRequestException('Pedido pago não pode ser cancelado');
    }
    await this.reservaEstoqueService.liberarEstoque(pedido.idPedido);
    pedido.statusPedido = Status.CANCELADO;
    return await this.pedidoRepository.save(pedido);
  }

  async verificarDisponibilidade(idPedido: number): Promise<boolean> {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['itemPedidos', 'itemPedidos.produto'],
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return await this.reservaEstoqueService.verificarDisponibilidade(pedido);
  }
}