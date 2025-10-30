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
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { Status } from 'src/pedido/entities/pedido.entity';

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

  async create(createPagamentoDto: CreatePagamentoDto): Promise<Pagamento> {
    const { idPedido, valor, metodoPag } = createPagamentoDto;
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['pagamento', 'itemPedidos', 'itemPedidos.produto'],
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (pedido.statusPedido !== 'Aguardando pagamento') {
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
    const pagamento = this.pagamentoRepository.create({
      valor,
      metodoPag,
      statusPag: StatusPag.PENDENTE,
      pedido,
    });
    return await this.pagamentoRepository.save(pagamento);
  }

  async findAll(): Promise<Pagamento[]> {
    return this.pagamentoRepository.find({
      relations: ['pedido'],
    });
  }

  async findOne(id: number): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: id },
      relations: ['pedido', 'pedido.itemPedidos', 'pedido.itemPedidos.produto'],
    });
    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado.');
    }
    return pagamento;
  }

  async update(
    id: number,
    updatePagamentoDto: UpdatePagamentoDto,
  ): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: id },
      relations: ['pedido', 'pedido.itemPedidos', 'pedido.itemPedidos.produto'],
    });
    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado.');
    }
    if (
      updatePagamentoDto.metodoPag &&
      updatePagamentoDto.metodoPag !== pagamento.metodoPag
    ) {
      throw new BadRequestException(
        'Não é permitido alterar o método de pagamento após o registro.',
      );
    }
    if (updatePagamentoDto.statusPag === 'Pago') {
      if (pagamento.statusPag === StatusPag.PAGO) {
        Object.assign(pagamento, updatePagamentoDto);
        return await this.pagamentoRepository.save(pagamento);
      }
      const pedido = await this.pedidoRepository.findOne({
        where: { idPedido: pagamento.pedido.idPedido },
        relations: ['itemPedidos', 'itemPedidos.produto'],
      });
      if (!pedido)
        throw new NotFoundException('Pedido vinculado não encontrado.');
      for (const item of pedido.itemPedidos) {
        const produto = item.produto;
        if (!produto) {
          throw new NotFoundException(
            `Produto do item ${item.idItem ?? '(sem id)'} não encontrado.`,
          );
        }
        if (produto.estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto "${produto.nome}" (id: ${produto.idProduto}).`,
          );
        }
      }
      for (const item of pedido.itemPedidos) {
        const produto = item.produto;
        produto.estoque = produto.estoque - item.quantidade;
        await this.produtoRepository.save(produto);
      }
      pedido.statusPedido = Status.PAGO;
      await this.pedidoRepository.save(pedido);
      Object.assign(pagamento, updatePagamentoDto);
      pagamento.statusPag = StatusPag.PAGO;
      await this.pagamentoRepository.save(pagamento);
      return pagamento;
    }
    if (updatePagamentoDto.statusPag === 'Cancelado') {
      if (pagamento.statusPag === StatusPag.PAGO) {
        throw new BadRequestException(
          'Pagamento já confirmado (PAGO) não pode ser cancelado via este endpoint.',
        );
      }
      const pedido = await this.pedidoRepository.findOne({
        where: { idPedido: pagamento.pedido.idPedido },
      });
      if (!pedido)
        throw new NotFoundException('Pedido vinculado não encontrado.');
      pedido.statusPedido = Status.ABERTO;
      await this.pedidoRepository.save(pedido);
      Object.assign(pagamento, updatePagamentoDto);
      pagamento.statusPag = StatusPag.CANCELADO;
      await this.pagamentoRepository.save(pagamento);
      return pagamento;
    }
    Object.assign(pagamento, updatePagamentoDto);
    return await this.pagamentoRepository.save(pagamento);
  }

  async remove(id: number): Promise<void> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { idPag: id },
    });
    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado.');
    }
    await this.pagamentoRepository.remove(pagamento);
  }
}
