import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LimpezaReservasCronService } from './limpeza-reservas-cron.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Admin - Manutenção')
@Controller('admin/manutencao')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class ProdutoCronController {
  constructor(
    private readonly limpezaReservasCronService: LimpezaReservasCronService,
  ) {}

  @Post('limpar-reservas-expiradas')
  @ApiOperation({ summary: 'Executar limpeza manual de reservas expiradas' })
  async executarLimpezaManual() {
    await this.limpezaReservasCronService.handleLimpezaReservasExpiradas();
    return { message: 'Limpeza de reservas expiradas executada com sucesso' };
  }
}
