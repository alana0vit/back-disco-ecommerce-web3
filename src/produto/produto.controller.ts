import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProdutoService } from './produto.service';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Produtos')
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastrar um novo produto (com imagem)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do produto + imagem',
    type: CreateProdutoDto,
  })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado (apenas ADMIN)' })
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async create(
    @Body() createProdutoDto: CreateProdutoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.produtoService.create(createProdutoDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: [Produto],
  })
  async findAll(): Promise<Produto[]> {
    return await this.produtoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get('filtro')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Filtrar produtos por nome, categoria e preço' })
  @ApiQuery({
    name: 'nome',
    required: false,
    description: 'Filtrar pelo nome do produto',
  })
  @ApiQuery({
    name: 'categoria',
    required: false,
    description: 'Filtrar pela categoria do produto',
  })
  @ApiQuery({
    name: 'precoMin',
    required: false,
    description: 'Preço mínimo',
    example: 10,
  })
  @ApiQuery({
    name: 'precoMax',
    required: false,
    description: 'Preço máximo',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista filtrada de produtos retornada com sucesso',
    type: [Produto],
  })
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar produto pelo ID (com disponibilidade)' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOneWithDisponivel(@Param('id') id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber) || idNumber <= 0) {
      throw new BadRequestException('ID do produto deve ser um número válido e positivo');
    }
    return await this.produtoService.findOneWithDisponivel(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto pelo ID (com ou sem imagem)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiBody({
    description: 'Dados atualizados do produto',
    type: UpdateProdutoDto,
  })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Produto> {
    return await this.produtoService.update(+id, updateProdutoDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.produtoService.remove(+id);
  }
}
