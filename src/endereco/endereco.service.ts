import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { Endereco } from './entities/endereco.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(Endereco)
    private readonly enderecoRepository: Repository<Endereco>,
  ) {}

  async create(createEnderecoDto: CreateEnderecoDto): Promise<Endereco> {
    const endereco = this.enderecoRepository.create(createEnderecoDto);
    return await this.enderecoRepository.save(endereco);
  }

  async findAll(): Promise<Endereco[]> {
    return await this.enderecoRepository.find();
  }

  async findOne(id: number): Promise<Endereco> {
    const endereco = await this.enderecoRepository.findOneBy({
      idEndereco: id,
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
    });
    if (!endereco) {
      throw new Error('Endereço não encontrado');
    }
    if (endereco.padrao) {
      throw new Error('O endereço já é padrão!');
    }
    const antigo = await this.enderecoRepository.findOne({
      where: { padrao: true },
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
