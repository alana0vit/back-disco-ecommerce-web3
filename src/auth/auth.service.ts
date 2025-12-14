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
  ) {}

  async validateUser(email: string, senhaRecebida: string): Promise<any> {
    // ← ALTERADO: nome → email
    // Buscar por email ao invés de nome
    const user = await this.clienteRepository.findOne({ where: { email } });

    console.log('Validating user by email:', email, 'Found user:', user);

    if (user && (await bcrypt.compare(senhaRecebida, user.senha))) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.idCliente, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        // ← ADICIONE ISSO para retornar os dados do usuário
        id: user.idCliente,
        nome: user.nome,
        email: user.email,
        role: user.role,
        telefone: user.telefone,
        dataNasc: user.dataNasc,
      },
    };
  }

  async register(dto: RegisterDto) {
    // Verificar se email já existe
    const existingUser = await this.clienteRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.senha, 10);
    const user = this.clienteRepository.create({
      email: dto.email,
      nome: dto.nome,
      role: dto.role,
      senha: hashedPassword,
      dataNasc: dto.dataNasc,
      telefone: dto.telefone,
      ativo: dto.ativo !== undefined ? dto.ativo : true, // Default true
    });

    const savedUser = await this.clienteRepository.save(user);

    // Retornar dados sem a senha
    const { senha, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}
