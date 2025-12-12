import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Categorias')
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  // ========== ROTA PÚBLICA (SEM AUTENTICAÇÃO) ==========

  @Get('public')
  @ApiOperation({ summary: 'Listar todas as categorias (público)' })
  @ApiResponse({
    status: 200,
    description: 'Lista todas as categorias cadastradas no sistema.',
    type: [Categoria],
  })
  async findAllPublic(): Promise<Categoria[]> {
    return await this.categoriaService.findAll();
  }

  // ========== ROTAS PROTEGIDAS (COM AUTENTICAÇÃO) ==========

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova categoria (ADMIN)' })
  @ApiBody({ type: CreateCategoriaDto })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso.',
    type: Categoria,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas ADMIN pode criar categorias.',
  })
  async create(
    @Body() createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.create(createCategoriaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as categorias (CLIENTE)' })
  @ApiResponse({
    status: 200,
    description: 'Lista todas as categorias cadastradas no sistema.',
    type: [Categoria],
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado.',
  })
  async findAll(): Promise<Categoria[]> {
    return await this.categoriaService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar uma categoria pelo ID (CLIENTE)' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria que será buscada',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso.',
    type: Categoria,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  async findOne(@Param('id') id: string): Promise<Categoria> {
    return await this.categoriaService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma categoria existente (ADMIN)' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria que será atualizada',
    example: 1,
  })
  @ApiBody({ type: UpdateCategoriaDto })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso.',
    type: Categoria,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas ADMIN pode atualizar categorias.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.update(+id, updateCategoriaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma categoria (ADMIN)' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria que será removida',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida com sucesso.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado. Apenas ADMIN pode remover categorias.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoriaService.remove(+id);
  }
}
