import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento, StatusPag, Metodo } from './entities/pagamento.entity';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { Pedido, Status as StatusPedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';

@Injectable()
export class PagamentoService {
  constructor(
    @InjectRepository(Pagamento)
    private readonly pagamentoRepository: Repository<Pagamento>,

    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async create(dto: CreatePagamentoDto): Promise<Pagamento> {
    const { idPedido, valor, metodoPag } = dto;

    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['pagamento', 'itemPedidos', 'itemPedidos.produto'],
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (pedido.statusPedido !== StatusPedido.AGUARDANDO) {
      throw new BadRequestException(
        'Só é possível criar pagamento para pedidos aguardando pagamento.',
      );
    }

    if (pedido.pagamento && pedido.pagamento.statusPag !== StatusPag.CANCELADO) {
      throw new ConflictException('Este pedido já possui um pagamento ativo.');
    }

    for (const item of pedido.itemPedidos) {
      const produto = item.produto;
      const reservado = await this.getQuantidadeReservada(produto.idProduto);

      const disponivel = produto.estoque - reservado;

      if (disponivel < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto "${produto.nome}". Disponível: ${disponivel}`,
        );
      }
    }

    const pagamento = this.pagamentoRepository.create({
      valor,
      metodoPag,
      statusPag: StatusPag.PENDENTE,
      pedido,
    });

    return await this.pagamentoRepository.save(pagamento);
  }

  private async getQuantidadeReservada(idProduto: number): Promise<number> {
    const pendentes = await this.pagamentoRepository
      .createQueryBuilder('pagamento')
      .leftJoinAndSelect('pagamento.pedido', 'pedido')
      .leftJoinAndSelect('pedido.itemPedidos', 'itemPedidos')
      .leftJoinAndSelect('itemPedidos.produto', 'produto')
      .where('pagamento.statusPag = :status', { status: StatusPag.PENDENTE })
      .andWhere('produto.idProduto = :idProduto', { idProduto })
      .getMany();

    let total = 0;

    for (const pag of pendentes) {
      for (const item of pag.pedido.itemPedidos) {
        if (item.produto.idProduto === idProduto) {
          total += item.quantidade;
        }
      }
    }

    return total;
  }

  async update(id: number, dto: UpdatePagamentoDto): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: id },
      relations: ['pedido', 'pedido.itemPedidos', 'pedido.itemPedidos.produto'],
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    if (dto.metodoPag && dto.metodoPag !== pagamento.metodoPag) {
      throw new BadRequestException('Não é permitido alterar o método de pagamento.');
    }

    const pedido = pagamento.pedido;

    if (dto.statusPag === StatusPag.PAGO) {
      if (pagamento.statusPag === StatusPag.PAGO) {
        Object.assign(pagamento, dto);
        return await this.pagamentoRepository.save(pagamento);
      }

      for (const item of pedido.itemPedidos) {
        const produto = item.produto;

        if (produto.estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para "${produto.nome}".`,
          );
        }

        produto.estoque -= item.quantidade;
        await this.produtoRepository.save(produto);
      }

      pedido.statusPedido = StatusPedido.PAGO;
      await this.pedidoRepository.save(pedido);

      pagamento.statusPag = StatusPag.PAGO;
      Object.assign(pagamento, dto);
      return await this.pagamentoRepository.save(pagamento);
    }

    if (dto.statusPag === StatusPag.CANCELADO) {
      if (pagamento.statusPag === StatusPag.PAGO) {
        throw new BadRequestException(
          'Pagamento já confirmado não pode ser cancelado.',
        );
      }

      pedido.statusPedido = StatusPedido.ABERTO;
      await this.pedidoRepository.save(pedido);

      pagamento.statusPag = StatusPag.CANCELADO;
      Object.assign(pagamento, dto);
      return await this.pagamentoRepository.save(pagamento);
    }

    Object.assign(pagamento, dto);
    return await this.pagamentoRepository.save(pagamento);
  }

  async findAll(): Promise<Pagamento[]> {
    return this.pagamentoRepository.find({ relations: ['pedido'] });
  }

  async findOne(id: number): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: id },
      relations: ['pedido', 'pedido.itemPedidos', 'pedido.itemPedidos.produto'],
    });

    if (!pagamento) throw new NotFoundException('Pagamento não encontrado.');

    return pagamento;
  }

  async remove(id: number): Promise<void> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: id },
    });

    if (!pagamento) throw new NotFoundException('Pagamento não encontrado.');

    await this.pagamentoRepository.remove(pagamento);
  }
}