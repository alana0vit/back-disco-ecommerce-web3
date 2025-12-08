import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards ,
} from '@nestjs/common';
import { Pagamento } from './entities/pagamento.entity';
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Post()
  async create(
    @Body() createPagamentoDto: CreatePagamentoDto,
  ): Promise<Pagamento> {
    return await this.pagamentoService.create(createPagamentoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get()
  async findAll(): Promise<Pagamento[]> {
    return await this.pagamentoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pagamento> {
    return await this.pagamentoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ): Promise<Pagamento> {
    return await this.pagamentoService.update(+id, updatePagamentoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.pagamentoService.remove(+id);
  }
}
