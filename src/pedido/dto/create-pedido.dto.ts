import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateClienteDto } from 'src/cliente/dto/create-cliente.dto';
import { CreateEnderecoDto } from 'src/endereco/dto/create-endereco.dto';
import { CreateItemPedidoDto } from 'src/item-pedido/dto/create-item-pedido.dto';
import { CreatePagamentoDto } from 'src/pagamento/dto/create-pagamento.dto';

enum Status {
  ABERTO = 'Aberto',
  AGUARDANDO = 'Aguardando pagamento',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}
export class CreatePedidoDto {
  @IsEnum(Status)
  @IsNotEmpty()
  statusPedido: Status = Status.ABERTO;

  @IsNotEmpty()
  @IsDecimal()
  valorTotal: number;

  @IsNumber()
  @IsNotEmpty()
  qtdTotal: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dataPedido: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateClienteDto)
  cliente: CreateClienteDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco: CreateEnderecoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  itemPedido: CreateItemPedidoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePagamentoDto)
  pagamento: CreatePagamentoDto;
}
