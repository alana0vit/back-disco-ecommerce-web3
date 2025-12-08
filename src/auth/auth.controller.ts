import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Verifica as credenciais e retorna o token de acesso' })
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
    const user = await this.authService.validateUser(dto.nome, dto.senha);

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
    return this.authService.register(dto);
  }
}