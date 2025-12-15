import {
  Controller,
  Post,
  Body,
  ConflictException,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Verifica as credenciais e retorna o token de acesso',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna um access_token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas.',
  })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.senha);

    if (!user) {
      return { message: 'Credenciais inválidas' };
    }

    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário no sistema' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já existente.',
  })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      if (error.message === 'Email já cadastrado') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicita recuperação de senha por email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com instruções de recuperação',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Redefine a senha usando o token recebido por email',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou expirado',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('validate-reset-token/:token')
  @ApiOperation({ summary: 'Valida se um token de reset é válido' })
  @ApiParam({
    name: 'token',
    description: 'Token de recuperação recebido por email',
  })
  @ApiResponse({
    status: 200,
    description: 'Token é válido ou inválido',
    schema: {
      example: { valid: true, email: 'usuario@email.com' },
    },
  })
  async validateResetToken(@Param('token') token: string) {
    return await this.authService.validateResetToken(token);
  }
}
