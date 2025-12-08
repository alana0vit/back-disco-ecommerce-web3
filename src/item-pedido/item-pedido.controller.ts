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

@Controller('item-pedido')
export class ItemPedidoController {
  constructor(private readonly itemPedidoService: ItemPedidoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Post()
  async create(
    @Body() createItemPedidoDto: CreateItemPedidoDto,
  ): Promise<ItemPedido> {
    return await this.itemPedidoService.create(createItemPedidoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get()
  async findAll(): Promise<ItemPedido[]> {
    return await this.itemPedidoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemPedido> {
    return await this.itemPedidoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemPedidoDto: UpdateItemPedidoDto,
  ): Promise<ItemPedido> {
    return await this.itemPedidoService.update(+id, updateItemPedidoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.itemPedidoService.remove(+id);
  }
}
