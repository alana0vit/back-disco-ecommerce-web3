import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(nome: string, senhaRecebida: string): Promise<any> {
    const user = await this.clienteRepository.findOne({ where: { nome } });

    console.log('Validating user:', nome, 'Found user:', user);

    if (user && await bcrypt.compare(senhaRecebida, user.senha)) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { nome: user.nome, sub: user.idCliente, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.senha, 10);
    const user = this.clienteRepository.create({
      email: dto.email,
      nome: dto.nome,
      role: dto.role,
      senha: hashedPassword,
      dataNasc: dto.dataNasc,
      telefone: dto.telefone,
      ativo: dto.ativo
    });
    return this.clienteRepository.save(user);
  }
}