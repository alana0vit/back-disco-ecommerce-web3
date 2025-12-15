import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CarrinhoService } from './carrinho.service';
import { CreateCarrinhoItemDto } from 'src/carrinho-item/dto/create-carrinho-item.dto';
import { UpdateCarrinhoItemDto } from 'src/carrinho-item/dto/update-carrinho-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/cliente/entities/cliente.entity';

@ApiTags('Carrinho')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get(':idCliente')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  getCarrinho(@Param('idCliente') idCliente: number) {
    return this.carrinhoService.getOrCreateCarrinho(idCliente);
  }

  @Post(':idCliente/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  addItem(
    @Param('idCliente') idCliente: number,
    @Body() dto: CreateCarrinhoItemDto,
  ) {
    return this.carrinhoService.addItem(idCliente, dto);
  }

  @Patch(':idCliente/update/:idItem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  updateQtd(
    @Param('idCliente') idCliente: number,
    @Param('idItem') idItem: number,
    @Body() dto: UpdateCarrinhoItemDto,
  ) {
    return this.carrinhoService.updateQuantidade(idCliente, idItem, dto);
  }

  @Delete(':idCliente/remove/:idItem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE', 'ADMIN')
  removeItem(
    @Param('idCliente') idCliente: number,
    @Param('idItem') idItem: number,
  ) {
    return this.carrinhoService.removeItem(idCliente, idItem);
  }
}
