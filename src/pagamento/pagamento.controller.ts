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
import { Pagamento } from './entities/pagamento.entity';
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
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

@ApiTags('Pagamentos')
@ApiBearerAuth()
@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Post()
  @ApiOperation({ summary: 'Cria um novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso.' })
  async create(
    @Body() createPagamentoDto: CreatePagamentoDto,
  ): Promise<Pagamento> {
    return await this.pagamentoService.create(createPagamentoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get()
  @ApiOperation({ summary: 'Lista todos os pagamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos retornada com sucesso.',
  })
  async findAll(): Promise<Pagamento[]> {
    return await this.pagamentoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Busca um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento encontrado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Pagamento> {
    return await this.pagamentoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento atualizado com sucesso.',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ): Promise<Pagamento> {
    return await this.pagamentoService.update(+id, updatePagamentoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento removido com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.pagamentoService.remove(+id);
  }
}
