import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { Pedido } from './entities/pedido.entity';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @Post('/:idCarrinho')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  async create(
    @Body() createPedidoDto: CreatePedidoDto,
    @Param('idCarrinho', ParseIntPipe) idCarrinho: number
  ) {
    return this.pedidoService.create(createPedidoDto, idCarrinho);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get('lista/:id')
  @ApiOperation({ summary: 'Lista todos os pedidos de um cliente específico' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Pedidos do cliente retornados com sucesso.' })
  async findAllByCliente(@Param('id') id: number): Promise<Pedido[]> {
    return this.pedidoService.findAllByCliente(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Busca um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Pedido> {
    return await this.pedidoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso.' })
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    return await this.pedidoService.update(+id, updatePedidoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido' })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.pedidoService.remove(+id);
  }
}