import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Pedido } from './entities/pedido.entity';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    return await this.pedidoService.create(createPedidoDto);
  }

  @Get('lista/:id')
  async findAllByCliente(@Param('id') id: number): Promise<Pedido[]> {
    return this.pedidoService.findAllByCliente(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pedido> {
    return await this.pedidoService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    return await this.pedidoService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.pedidoService.remove(+id);
  }
}
