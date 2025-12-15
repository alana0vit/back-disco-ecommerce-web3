import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarrinhoItem } from './entities/carrinho-item.entity';
import { CreateCarrinhoItemDto } from './dto/create-carrinho-item.dto';
import { UpdateCarrinhoItemDto } from './dto/update-carrinho-item.dto';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';
import { Produto } from 'src/produto/entities/produto.entity';

@Injectable()
export class CarrinhoItemService {
  constructor(
    @InjectRepository(CarrinhoItem)
    private readonly itemRepo: Repository<CarrinhoItem>,

    @InjectRepository(Carrinho)
    private readonly carrinhoRepo: Repository<Carrinho>,

    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,
  ) {}

  async create(
    idCarrinho: number,
    dto: CreateCarrinhoItemDto,
  ): Promise<CarrinhoItem> {
    const carrinho = await this.carrinhoRepo.findOne({
      where: { idCarrinho },
      relations: ['itens'],
    });
    if (!carrinho) throw new NotFoundException('Carrinho não encontrado');

    const produto = await this.produtoRepo.findOne({
      where: { idProduto: dto.id_produto },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');

    if (produto.estoque < dto.quantidade) {
      throw new BadRequestException(
        'Estoque insuficiente para adicionar esse item',
      );
    }

    // Se já existir item no carrinho para o mesmo produto, incrementar quantidade
    const existente = carrinho.itens.find(
      (i) => i.produto.idProduto === produto.idProduto,
    );

    if (existente) {
      const novaQtd = existente.quantidade + dto.quantidade;
      if (novaQtd > produto.estoque) {
        throw new BadRequestException(
          'Estoque insuficiente para essa quantidade',
        );
      }
      existente.quantidade = novaQtd;
      existente.subtotal = Number(produto.preco) * existente.quantidade;
      await this.itemRepo.save(existente);
      await this.recalcCarrinhoTotal(carrinho.idCarrinho);
      return existente;
    }

    const item = this.itemRepo.create({
      quantidade: dto.quantidade,
      subtotal: Number(produto.preco) * dto.quantidade,
      produto,
      carrinho,
    });

    await this.itemRepo.save(item);
    await this.recalcCarrinhoTotal(carrinho.idCarrinho);
    return item;
  }

  async findAll(): Promise<CarrinhoItem[]> {
    return this.itemRepo.find({ relations: ['produto', 'carrinho'] });
  }

  async findOne(idItem: number): Promise<CarrinhoItem> {
    const item = await this.itemRepo.findOne({
      where: { idItem },
      relations: ['produto', 'carrinho'],
    });
    if (!item) throw new NotFoundException('Item do carrinho não encontrado');
    return item;
  }

  async update(
    idItem: number,
    dto: UpdateCarrinhoItemDto,
  ): Promise<CarrinhoItem> {
    const item = await this.itemRepo.findOne({
      where: { idItem },
      relations: ['produto', 'carrinho'],
    });
    if (!item) throw new NotFoundException('Item do carrinho não encontrado');

    if (dto.quantidade !== undefined) {
      if (dto.quantidade <= 0)
        throw new BadRequestException('Quantidade deve ser >= 1');

      if (item.produto.estoque < dto.quantidade) {
        throw new BadRequestException(
          'Estoque insuficiente para essa quantidade',
        );
      }

      item.quantidade = dto.quantidade;
      item.subtotal = Number(item.produto.preco) * item.quantidade;
    }

    await this.itemRepo.save(item);
    await this.recalcCarrinhoTotal(item.carrinho.idCarrinho);
    return item;
  }

  async remove(idItem: number): Promise<{ message: string }> {
    const item = await this.itemRepo.findOne({
      where: { idItem },
      relations: ['carrinho'],
    });
    if (!item) throw new NotFoundException('Item do carrinho não encontrado');

    const idCarrinho = item.carrinho.idCarrinho;
    await this.itemRepo.remove(item);
    await this.recalcCarrinhoTotal(idCarrinho);

    return { message: 'Item removido com sucesso' };
  }

  // Helper: recalcula total do carrinho
  private async recalcCarrinhoTotal(idCarrinho: number) {
    const carrinho = await this.carrinhoRepo.findOne({
      where: { idCarrinho },
      relations: ['itens'],
    });
    if (!carrinho) throw new NotFoundException('Carrinho não encontrado');
    const total = carrinho.itens.reduce(
      (acc, it) => acc + Number(it.subtotal),
      0,
    );
    carrinho.total = total;
    await this.carrinhoRepo.save(carrinho);
    return carrinho;
  }
}
