import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Endereco } from './entities/endereco.entity';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Controller('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Post(':idCliente')
  async create(
    @Param('idCliente', ParseIntPipe) idCliente: number,
    @Body() createEnderecoDto: CreateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.create(createEnderecoDto, idCliente);
  }

  @Get()
  async findAll(): Promise<Endereco[]> {
    return await this.enderecoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Endereco> {
    return await this.enderecoService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.update(+id, updateEnderecoDto);
  }

  @Patch('padrao/:id')
  async defaultUpdate(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.defaultUpdate(+id, updateEnderecoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.enderecoService.remove(+id);
  }
}
