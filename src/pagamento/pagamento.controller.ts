import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Pagamento } from './entities/pagamento.entity';
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  async create(
    @Body() createPagamentoDto: CreatePagamentoDto,
  ): Promise<Pagamento> {
    return await this.pagamentoService.create(createPagamentoDto);
  }

  @Get()
  async findAll(): Promise<Pagamento[]> {
    return await this.pagamentoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pagamento> {
    return await this.pagamentoService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ): Promise<Pagamento> {
    return await this.pagamentoService.update(+id, updatePagamentoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.pagamentoService.remove(+id);
  }
}
