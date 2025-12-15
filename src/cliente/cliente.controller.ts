import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Cliente } from './entities/cliente.entity';
import { ClienteService } from './cliente.service';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso.',
    type: [Cliente],
  })
  async findAll(): Promise<Cliente[]> {
    return await this.clienteService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Busca um cliente pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso.',
    type: Cliente,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado.',
  })
  async findOne(@Param('id') id: string): Promise<Cliente> {
    return await this.clienteService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um cliente' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso.',
    type: Cliente,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    return await this.clienteService.update(+id, updateClienteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cliente pelo ID' })
  @ApiResponse({
    status: 204,
    description: 'Cliente removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.clienteService.remove(+id);
  }
}
