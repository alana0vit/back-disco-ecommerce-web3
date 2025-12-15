import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrinho } from './entities/carrinho.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { CarrinhoItem } from 'src/carrinho-item/entities/carrinho-item.entity';
import { CreateCarrinhoItemDto } from 'src/carrinho-item/dto/create-carrinho-item.dto';
import { UpdateCarrinhoItemDto } from 'src/carrinho-item/dto/update-carrinho-item.dto';

@Injectable()
export class CarrinhoService {
  constructor(
    @InjectRepository(Carrinho)
    private carrinhoRepo: Repository<Carrinho>,

    @InjectRepository(CarrinhoItem)
    private itemRepo: Repository<CarrinhoItem>,

    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,

    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,
  ) {}

  async getOrCreateCarrinho(idCliente: number): Promise<Carrinho> {
    const cliente = await this.clienteRepo.findOne({ where: { idCliente } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    let carrinho = await this.carrinhoRepo.findOne({
      where: { cliente },
      relations: ['itens'],
    });

    if (!carrinho) {
      carrinho = this.carrinhoRepo.create({
        cliente,
        total: 0,
        itens: [],
      });
      await this.carrinhoRepo.save(carrinho);
    }

    return carrinho;
  }

  async addItem(idCliente: number, dto: CreateCarrinhoItemDto) {
    const carrinho = await this.getOrCreateCarrinho(idCliente);
    const produto = await this.produtoRepo.findOne({
      where: { idProduto: dto.id_produto },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');

    if (produto.estoque < dto.quantidade)
      throw new BadRequestException('Estoque insuficiente');

    let item = carrinho.itens.find(
      (i) => i.produto.idProduto === produto.idProduto,
    );

    if (item) {
      item.quantidade += dto.quantidade;

      if (item.quantidade > produto.estoque)
        throw new BadRequestException('Estoque insuficiente');

      item.subtotal = item.quantidade * Number(produto.preco);
      await this.itemRepo.save(item);
    } else {
      item = this.itemRepo.create({
        quantidade: dto.quantidade,
        subtotal: dto.quantidade * Number(produto.preco),
        produto,
        carrinho,
      });
      await this.itemRepo.save(item);
    }

    return this.updateCarrinhoTotal(carrinho.idCarrinho);
  }

  async updateQuantidade(
    idCliente: number,
    idItem: number,
    dto: UpdateCarrinhoItemDto,
  ) {
    const carrinho = await this.getOrCreateCarrinho(idCliente);

    const item = await this.itemRepo.findOne({
      where: { idItem },
      relations: ['produto', 'carrinho'],
    });

    if (!item || item.carrinho.idCarrinho !== carrinho.idCarrinho)
      throw new NotFoundException('Item não encontrado');

    if (item.produto.estoque < dto.quantidade)
      throw new BadRequestException('Estoque insuficiente');

    item.quantidade = dto.quantidade;
    item.subtotal = dto.quantidade * Number(item.produto.preco);
    await this.itemRepo.save(item);

    return this.updateCarrinhoTotal(carrinho.idCarrinho);
  }

  async removeItem(idCliente: number, idItem: number) {
    const carrinho = await this.getOrCreateCarrinho(idCliente);

    const item = await this.itemRepo.findOne({
      where: { idItem },
      relations: ['carrinho'],
    });

    if (!item || item.carrinho.idCarrinho !== carrinho.idCarrinho)
      throw new NotFoundException('Item não encontrado');

    await this.itemRepo.remove(item);
    await this.updateCarrinhoTotal(carrinho.idCarrinho);

    return { message: 'Item removido' };
  }

  async updateCarrinhoTotal(idCarrinho: number) {
    const carrinho = await this.carrinhoRepo.findOne({
      where: { idCarrinho },
      relations: ['itens'],
    });

    if (!carrinho) throw new NotFoundException('Carrinho não encontrado');

    const total = carrinho.itens.reduce(
      (acc, item) => acc + Number(item.subtotal),
      0,
    );
    carrinho.total = total;

    return this.carrinhoRepo.save(carrinho);
  }
}
