import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Pagamento, StatusPag } from 'src/pagamento/entities/pagamento.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    @InjectRepository(Pagamento)
    private readonly pagamentoRepository: Repository<Pagamento>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const categoria = await this.categoriaRepository.findOne({
      where: { idCategoria: createProdutoDto.idCategoria },
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    const produto = this.produtoRepository.create({
      ...createProdutoDto,
      categoria,
    });
    return await this.produtoRepository.save(produto);
  }

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: ['categoria'],
      where: { ativo: true },
    });
  }

  async findAllWithDisponivel(): Promise<any[]> {
    const produtos: Produto[] = await this.produtoRepository.find({
      relations: ['categoria'],
      where: { ativo: true },
    });
    const result: (Produto & { estoqueDisponivel: number })[] = [];
    for (const produto of produtos) {
      const reservado: number = await this.getQuantidadeReservada(
        produto.idProduto,
      );
      result.push({
        ...produto,
        estoqueDisponivel: produto.estoque - reservado,
      });
    }
    return result;
  }

  async findOneWithDisponivel(id: number): Promise<any> {
    const produto = await this.produtoRepository.findOne({
      where: { idProduto: id },
      relations: ['categoria'],
    });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    const reservado = await this.getQuantidadeReservada(produto.idProduto);
    return {
      ...produto,
      estoqueDisponivel: produto.estoque - reservado,
    };
  }

  private async getQuantidadeReservada(idProduto: number): Promise<number> {
    const pendentes = await this.pagamentoRepository
      .createQueryBuilder('pagamento')
      .leftJoin('pagamento.pedido', 'pedido')
      .leftJoin('pedido.itemPedidos', 'itemPedidos')
      .where('pagamento.statusPag = :status', { status: StatusPag.PENDENTE })
      .andWhere('itemPedidos.produtoIdProduto = :idProduto', { idProduto })
      .select('SUM(itemPedidos.quantidade)', 'reservado')
      .getRawOne();

    return Number(pendentes?.reservado ?? 0);
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { idProduto: id },
      relations: ['categoria'],
    });
    if (!produto) {
      throw new NotFoundException(`Produto não encontrado!`);
    }
    return produto;
  }

  async findWithFilters(
    nome?: string,
    categoria?: string,
    precoMin?: number,
    precoMax?: number,
  ): Promise<Produto[]> {
    const query = this.produtoRepository.createQueryBuilder('produto');
    if (nome) {
      query.andWhere('produto.nome ILIKE :nome', { nome: `%${nome}%` });
    }
    if (categoria) {
      query
        .leftJoinAndSelect('produto.categoria', 'categoria')
        .andWhere('LOWER(categoria.nome) LIKE LOWER(:categoria)', {
          categoria: `%${categoria}%`,
        });
    }
    if (precoMin !== undefined) {
      query.andWhere('produto.preco >= :precoMin', { precoMin });
    }
    if (precoMax !== undefined) {
      query.andWhere('produto.preco <= :precoMax', { precoMax });
    }
    const produtos = await query.getMany();
    if (produtos.length === 0) {
      throw new NotFoundException(
        'Nenhum produto encontrado com os filtros informados!',
      );
    }
    return produtos;
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produto = await this.findOne(id);
    if (updateProdutoDto.idCategoria) {
      const categoria = await this.categoriaRepository.findOne({
        where: { idCategoria: updateProdutoDto.idCategoria },
      });
      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }
      produto.categoria = categoria;
    }
    Object.assign(produto, updateProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
  }
}
