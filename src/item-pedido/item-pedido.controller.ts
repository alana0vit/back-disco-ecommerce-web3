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
import { ItemPedidoService } from './item-pedido.service';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { ItemPedido } from './entities/item-pedido.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Itens do Pedido')
@ApiBearerAuth()
@Controller('item-pedido')
export class ItemPedidoController {
  constructor(private readonly itemPedidoService: ItemPedidoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Post()
  @ApiOperation({ summary: 'Cria um novo item de pedido' })
  @ApiResponse({ status: 201, description: 'Item do pedido criado com sucesso.' })
  async create(
    @Body() createItemPedidoDto: CreateItemPedidoDto,
  ): Promise<ItemPedido> {
    return await this.itemPedidoService.create(createItemPedidoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get()
  @ApiOperation({ summary: 'Lista todos os itens de pedido' })
  @ApiResponse({ status: 200, description: 'Lista de itens do pedido retornada com sucesso.' })
  async findAll(): Promise<ItemPedido[]> {
    return await this.itemPedidoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Busca um item do pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do item do pedido' })
  @ApiResponse({ status: 200, description: 'Item do pedido encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Item do pedido não encontrado.' })
  async findOne(@Param('id') id: string): Promise<ItemPedido> {
    return await this.itemPedidoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um item do pedido' })
  @ApiParam({ name: 'id', description: 'ID do item do pedido' })
  @ApiResponse({ status: 200, description: 'Item do pedido atualizado com sucesso.' })
  async update(
    @Param('id') id: string,
    @Body() updateItemPedidoDto: UpdateItemPedidoDto,
  ): Promise<ItemPedido> {
    return await this.itemPedidoService.update(+id, updateItemPedidoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um item do pedido' })
  @ApiParam({ name: 'id', description: 'ID do item do pedido' })
  @ApiResponse({ status: 200, description: 'Item do pedido removido com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.itemPedidoService.remove(+id);
  }
}