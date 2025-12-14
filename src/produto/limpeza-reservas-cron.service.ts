import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservaEstoqueService } from './reserva-estoque.service';

@Injectable()
export class LimpezaReservasCronService {
  private readonly logger = new Logger(LimpezaReservasCronService.name);

  constructor(
    private readonly reservaEstoqueService: ReservaEstoqueService,
  ) {}
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleLimpezaReservasExpiradas() {
    this.logger.log('Iniciando limpeza de reservas de estoque expiradas...');
    
    try {
      const totalLiberado = await this.reservaEstoqueService.limparReservasExpiradas();
      
      if (totalLiberado > 0) {
        this.logger.log(`Limpeza concluída: ${totalLiberado} itens liberados`);
      } else {
        this.logger.debug('Nenhuma reserva expirada encontrada');
      }
    } catch (error) {
      this.logger.error(`Erro na limpeza de reservas: ${error.message}`, error.stack);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRelatorioDiario() {
    this.logger.log('Gerando relatório diário de reservas de estoque...');
  }
}