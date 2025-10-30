import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemPedidoService } from './item-pedido.service';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { ItemPedido } from './entities/item-pedido.entity';

@Controller('item-pedido')
export class ItemPedidoController {
  constructor(private readonly itemPedidoService: ItemPedidoService) {}

  @Post()
  async create(
    @Body() createItemPedidoDto: CreateItemPedidoDto,
  ): Promise<ItemPedido> {
    return await this.itemPedidoService.create(createItemPedidoDto);
  }

  @Get()
  async findAll(): Promise<ItemPedido[]> {
    return await this.itemPedidoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemPedido> {
    return await this.itemPedidoService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemPedidoDto: UpdateItemPedidoDto,
  ): Promise<ItemPedido> {
    return await this.itemPedidoService.update(+id, updateItemPedidoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.itemPedidoService.remove(+id);
  }
}
