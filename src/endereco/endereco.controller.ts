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

@Controller('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Post(':idCliente')
  async create(
    @Param('idCliente', ParseIntPipe) idCliente: number,
    @Body() createEnderecoDto: CreateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.create(createEnderecoDto, idCliente);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get()
  async findAll(): Promise<Endereco[]> {
    return await this.enderecoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Endereco> {
    return await this.enderecoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.update(+id, updateEnderecoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Patch('padrao/:id')
  async defaultUpdate(
    @Param('id') id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    return await this.enderecoService.defaultUpdate(+id, updateEnderecoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.enderecoService.remove(+id);
  }
}
