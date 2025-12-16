import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { Endereco } from './entities/endereco.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(
    createEnderecoDto: CreateEnderecoDto,
    idCliente: number,
  ): Promise<Endereco> {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente },
    });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }
    const endereco = this.enderecoRepository.create({
      ...createEnderecoDto,
      cliente,
    });
    return this.enderecoRepository.save(endereco);
  }

  async findByCliente(idCliente: number): Promise<Endereco[]> {
    return await this.enderecoRepository.find({
      where: { cliente: { idCliente } },
      relations: ['cliente', 'pedido'],
    });
  }

  async findOne(id: number): Promise<Endereco> {
    const endereco = await this.enderecoRepository.findOne({
      where: {
        idEndereco: id,
      },
      relations: ['cliente', 'pedido'],
    });
    if (!endereco) {
      throw new NotFoundException(`Endereço não encontrado!`);
    }
    return endereco;
  }

  async update(
    id: number,
    updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    const endereco = await this.findOne(id);
    Object.assign(endereco, updateEnderecoDto);
    return await this.enderecoRepository.save(endereco);
  }

  async defaultUpdate(
    id: number,
    updateEnderecoDto: UpdateEnderecoDto,
  ): Promise<Endereco> {
    const endereco = await this.enderecoRepository.findOne({
      where: { idEndereco: id },
      relations: ['cliente'],
    });
    if (!endereco) throw new NotFoundException('Endereço não encontrado');
    if (endereco.padrao) {
      throw new Error('O endereço já é padrão!');
    }
    const antigo = await this.enderecoRepository.findOne({
      where: {
        padrao: true,
        cliente: { idCliente: endereco.cliente.idCliente },
      },
    });
    if (antigo) {
      antigo.padrao = false;
      await this.enderecoRepository.save(antigo);
    }
    endereco.padrao = true;
    Object.assign(endereco, updateEnderecoDto);
    return await this.enderecoRepository.save(endereco);
  }

  async remove(id: number): Promise<void> {
    const endereco = await this.findOne(id);
    await this.enderecoRepository.remove(endereco);
  }
}
