import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { CarrinhoItemService } from './carrinho-item.service';
import { CreateCarrinhoItemDto } from './dto/create-carrinho-item.dto';
import { UpdateCarrinhoItemDto } from './dto/update-carrinho-item.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Itens do Carrinho')
@ApiBearerAuth()
@Controller('carrinho-item')
export class CarrinhoItemController {
  constructor(private readonly service: CarrinhoItemService) {}

  @Post(':idCarrinho')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiOperation({ summary: 'Adiciona um item ao carrinho' })
  @ApiParam({ name: 'idCarrinho', description: 'ID do carrinho', example: 1 })
  @ApiBody({ type: CreateCarrinhoItemDto })
  @ApiResponse({ status: 201, description: 'Item adicionado ao carrinho' })
  async create(
    @Param('idCarrinho', ParseIntPipe) idCarrinho: number,
    @Body() dto: CreateCarrinhoItemDto,
  ) {
    return this.service.create(idCarrinho, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiOperation({ summary: 'Lista todos os itens (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de itens retornada' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':idItem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiParam({ name: 'idItem', description: 'ID do item', example: 1 })
  @ApiOperation({ summary: 'Busca item do carrinho por ID' })
  @ApiResponse({ status: 200, description: 'Item retornado' })
  async findOne(@Param('idItem', ParseIntPipe) idItem: number) {
    return this.service.findOne(idItem);
  }

  @Patch(':idItem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiOperation({ summary: 'Atualiza quantidade do item' })
  @ApiParam({ name: 'idItem', description: 'ID do item', example: 1 })
  @ApiBody({ type: UpdateCarrinhoItemDto })
  @ApiResponse({ status: 200, description: 'Item atualizado' })
  async update(
    @Param('idItem', ParseIntPipe) idItem: number,
    @Body() dto: UpdateCarrinhoItemDto,
  ) {
    return this.service.update(idItem, dto);
  }

  @Delete(':idItem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiOperation({ summary: 'Remove um item do carrinho' })
  @ApiParam({ name: 'idItem', description: 'ID do item', example: 1 })
  @ApiResponse({ status: 200, description: 'Item removido' })
  async remove(@Param('idItem', ParseIntPipe) idItem: number) {
    return this.service.remove(idItem);
  }
}
