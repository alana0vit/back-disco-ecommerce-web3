import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Cliente } from './entities/cliente.entity';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return await this.clienteService.create(createClienteDto);
  }

  @Get()
  async findAll(): Promise<Cliente[]> {
    return await this.clienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cliente> {
    return await this.clienteService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    return await this.clienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.clienteService.remove(+id);
  }
}
