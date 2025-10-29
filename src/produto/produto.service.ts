import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
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
      query.andWhere('produto.categoria = :categoria', { categoria });
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
