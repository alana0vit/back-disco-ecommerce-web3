import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @Post()
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return await this.produtoService.create(createProdutoDto);
  }

  @Get()
  async findAll(): Promise<Produto[]> {
    return await this.produtoService.findAll();
  }

  @Get('filtro')
  async findWithFilters(
    @Query('nome') nome?: string,
    @Query('categoria') categoria?: string,
    @Query('precoMin') precoMin?: string,
    @Query('precoMax') precoMax?: string,
  ): Promise<Produto[]> {
    const precoMinNum =
      precoMin && !isNaN(Number(precoMin)) ? Number(precoMin) : undefined;
    const precoMaxNum =
      precoMax && !isNaN(Number(precoMax)) ? Number(precoMax) : undefined;
    return await this.produtoService.findWithFilters(
      nome,
      categoria,
      precoMinNum,
      precoMaxNum,
    );
  }
  
  @Get(':id')
  async findOneWithDisponivel(@Param('id') id: string) {
    return await this.produtoService.findOneWithDisponivel(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    return await this.produtoService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.produtoService.remove(+id);
  }
}