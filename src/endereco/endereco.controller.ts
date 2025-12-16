import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Endereco } from './entities/endereco.entity';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Endereço')
@ApiBearerAuth()
@Controller('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Post(':idCliente')
  @ApiOperation({ summary: 'Cria um endereço para um cliente' })
  @ApiParam({ name: 'idCliente', type: Number, description: 'ID do cliente' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  async create(
    @Param('idCliente', ParseIntPipe) idCliente: number,
    @Body() createEnderecoDto: CreateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.create(createEnderecoDto, idCliente);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get('cliente/:idCliente')
  @ApiOperation({ summary: 'Lista endereços por cliente' })
  @ApiParam({ name: 'idCliente', type: Number, description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async findByCliente(
    @Param('idCliente', ParseIntPipe) idCliente: number,
  ): Promise<Endereco[]> {
    return await this.enderecoService.findByCliente(idCliente);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Busca um endereço pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  async findOne(@Param('id') id: string): Promise<Endereco> {
    return await this.enderecoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um endereço pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.update(+id, updateEnderecoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Patch('padrao/:id')
  @ApiOperation({ summary: 'Define um endereço como padrão' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço padrão atualizado' })
  async defaultUpdate(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.defaultUpdate(+id, updateEnderecoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um endereço pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço removido com sucesso' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.enderecoService.remove(+id);
  }
}
