import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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
    // ALTERADO: Passar email em vez de nome
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
}
