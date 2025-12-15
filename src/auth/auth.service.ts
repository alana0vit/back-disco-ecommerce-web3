import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, senhaRecebida: string): Promise<any> {
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
    return await {
      access_token: this.jwtService.sign(payload),
      user: {
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
      ativo: dto.ativo !== undefined ? dto.ativo : true,
    });

    const savedUser = await this.clienteRepository.save(user);

    const { senha, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.clienteRepository.findOne({ where: { email } });
    if (!user) {
      return {
        message:
          'Se o email existir em nossa base, enviaremos instruções para recuperação',
      };
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000);
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = resetPasswordExpires;
    await this.clienteRepository.save(user);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8000'}/reset-password/${resetToken}`;
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.nome,
      resetUrl,
    );
    return {
      message:
        'Se o email existir em nossa base, enviaremos instruções para recuperação',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, novaSenha } = resetPasswordDto;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.clienteRepository.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }
    const isSamePassword = await bcrypt.compare(novaSenha, user.senha);
    if (isSamePassword) {
      throw new BadRequestException(
        'A nova senha não pode ser igual à senha atual',
      );
    }
    user.senha = await bcrypt.hash(novaSenha, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.clienteRepository.save(user);
    await this.emailService.sendPasswordChangedConfirmation(
      user.email,
      user.nome,
    );
    return { message: 'Senha alterada com sucesso' };
  }

  async validateResetToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.clienteRepository.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
      select: ['email'],
    });
    return {
      valid: !!user,
      email: user?.email,
    };
  }
}
