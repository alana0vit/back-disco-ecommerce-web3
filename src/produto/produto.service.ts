import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOneBy({ idProduto: id });
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
    Object.assign(produto, updateProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
  }
}
