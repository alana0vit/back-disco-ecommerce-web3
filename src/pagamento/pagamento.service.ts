import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento, StatusPag } from './entities/pagamento.entity';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import {
  Pedido,
  Status as StatusPedido,
} from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { ReservaEstoqueService } from 'src/produto/reserva-estoque.service';
import { PedidoService } from 'src/pedido/pedido.service';

@Injectable()
export class PagamentoService {
  constructor(
    @InjectRepository(Pagamento)
    private readonly pagamentoRepository: Repository<Pagamento>,

    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    private readonly reservaEstoqueService: ReservaEstoqueService,
    private readonly pedidoService: PedidoService,
  ) { }

  async create(dto: CreatePagamentoDto): Promise<Pagamento> {
    const { idPedido, valor, metodoPag } = dto;

    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido: dto.idPedido },
      relations: ['pagamento', 'itemPedidos', 'itemPedidos.produto'],
      select: {
        idPedido: true,
        statusPedido: true,
        valorTotal: true,
        pagamento: {
          idPag: true,
          statusPag: true,
        },
        itemPedidos: {
          idItem: true,
          quantidade: true,
          produto: {
            idProduto: true,
            estoque: true,
            estoqueReservado: true,
            preco: true,
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (pedido.statusPedido !== StatusPedido.AGUARDANDO) {
      throw new BadRequestException(
        'Só é possível criar pagamento para pedidos aguardando pagamento.',
      );
    }

    if (
      pedido.pagamento &&
      pedido.pagamento.statusPag !== StatusPag.CANCELADO
    ) {
      throw new ConflictException('Este pedido já possui um pagamento ativo.');
    }
    const disponivel =
      await this.reservaEstoqueService.verificarDisponibilidade(pedido);

    if (!disponivel) {
      throw new BadRequestException(
        'Estoque insuficiente para um ou mais produtos do pedido.',
      );
    }
    const valorPedido = pedido.valorTotal;
    const tolerancia = 0.01;

    if (Math.abs(valor - valorPedido) > tolerancia) {
      throw new BadRequestException(
        `Valor do pagamento (${valor}) não corresponde ao valor do pedido (${valorPedido}).`,
      );
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
    const produto = await this.produtoRepository.findOne({
      where: { idProduto },
      select: ['estoqueReservado'],
    });

    return produto?.estoqueReservado || 0;
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
      throw new BadRequestException(
        'Não é permitido alterar o método de pagamento.',
      );
    }

    const pedido = pagamento.pedido;
    if (dto.statusPag === StatusPag.PAGO) {
      if (pagamento.statusPag === StatusPag.PAGO) {
        Object.assign(pagamento, dto);
        return await this.pagamentoRepository.save(pagamento);
      }
      await this.pedidoService.confirmarPagamento(pedido.idPedido);

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
      await this.pedidoService.cancelarPedido(pedido.idPedido);
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
      relations: ['pedido'],
    });

    if (!pagamento) throw new NotFoundException('Pagamento não encontrado.');
    if (pagamento.statusPag === StatusPag.PENDENTE && pagamento.pedido) {
      await this.pedidoService.cancelarPedido(pagamento.pedido.idPedido);
    }

    await this.pagamentoRepository.remove(pagamento);
  }
  async aprovarPagamento(idPagamento: number): Promise<Pagamento> {
    return this.update(idPagamento, { statusPag: StatusPag.PAGO });
  }
  async cancelarPagamento(idPagamento: number): Promise<Pagamento> {
    return this.update(idPagamento, { statusPag: StatusPag.CANCELADO });
  }
  async verificarEstoqueParaPagamento(idPagamento: number): Promise<boolean> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: idPagamento },
      relations: ['pedido', 'pedido.itemPedidos', 'pedido.itemPedidos.produto'],
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return await this.reservaEstoqueService.verificarDisponibilidade(
      pagamento.pedido,
    );
  }
}