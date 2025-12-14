// reserva-estoque.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Status } from 'src/pedido/entities/pedido.entity';

@Injectable()
export class ReservaEstoqueService {
  private readonly logger = new Logger(ReservaEstoqueService.name);

  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
  ) { }

  async reservarEstoque(pedido: Pedido): Promise<void> {
    try {
      for (const item of pedido.itemPedidos) {
        const { produto, quantidade } = item;

        const resultado = await this.produtoRepository
          .createQueryBuilder()
          .update(Produto)
          .set({
            estoqueReservado: () => `estoqueReservado + ${quantidade}`
          })
          .where('idProduto = :id', { id: produto.idProduto })
          .andWhere('estoque - estoqueReservado >= :quantidade', {
            quantidade
          })
          .execute();

        if (resultado.affected === 0) {
          throw new Error(
            `Estoque insuficiente para o produto ${produto.nome}. ` +
            `Disponível: ${produto.estoque - produto.estoqueReservado}, ` +
            `Solicitado: ${quantidade}`
          );
        }

        this.logger.log(
          `Reservado ${quantidade} unidades do produto ${produto.nome} (ID: ${produto.idProduto})`
        );
      }
    } catch (error) {
      this.logger.error(`Erro ao reservar estoque: ${error.message}`);
      throw error;
    }
  }

  async liberarEstoque(pedidoId: number): Promise<void> {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { idPedido: pedidoId },
        relations: ['itemPedidos', 'itemPedidos.produto'],
      });

      if (!pedido) {
        throw new Error(`Pedido ${pedidoId} não encontrado`);
      }

      for (const item of pedido.itemPedidos) {
        const { produto, quantidade } = item;

        const resultado = await this.produtoRepository
          .createQueryBuilder()
          .update(Produto)
          .set({
            estoqueReservado: () => `GREATEST(estoqueReservado - ${quantidade}, 0)`
          })
          .where('idProduto = :id', { id: produto.idProduto })
          .andWhere('estoqueReservado >= :quantidade', {
            quantidade
          })
          .execute();

        if (resultado.affected === 0) {
          this.logger.warn(
            `Tentativa de liberar mais estoque do que reservado para produto ${produto.idProduto}`
          );

          await this.produtoRepository
            .createQueryBuilder()
            .update(Produto)
            .set({ estoqueReservado: 0 })
            .where('idProduto = :id', { id: produto.idProduto })
            .andWhere('estoqueReservado < 0')
            .execute();
        }

        this.logger.log(
          `Liberado ${quantidade} unidades do produto ${produto.nome} (ID: ${produto.idProduto})`
        );
      }
    } catch (error) {
      this.logger.error(`Erro ao liberar estoque: ${error.message}`);
      throw error;
    }
  }
  async confirmarEstoque(pedidoId: number): Promise<void> {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { idPedido: pedidoId },
        relations: ['itemPedidos', 'itemPedidos.produto'],
      });

      if (!pedido) {
        throw new Error(`Pedido ${pedidoId} não encontrado`);
      }

      for (const item of pedido.itemPedidos) {
        const { produto, quantidade } = item;
        const resultado = await this.produtoRepository
          .createQueryBuilder()
          .update(Produto)
          .set({
            estoque: () => `estoque - ${quantidade}`,
            estoqueReservado: () => `GREATEST(estoqueReservado - ${quantidade}, 0)`
          })
          .where('idProduto = :id', { id: produto.idProduto })
          .andWhere('estoqueReservado >= :quantidade', {
            quantidade
          })
          .execute();

        if (resultado.affected === 0) {
          throw new Error(
            `Erro ao confirmar estoque para produto ${produto.nome}. ` +
            `Verifique o estoque reservado.`
          );
        }

        this.logger.log(
          `Confirmado ${quantidade} unidades do produto ${produto.nome} (ID: ${produto.idProduto})`
        );
      }
    } catch (error) {
      this.logger.error(`Erro ao confirmar estoque: ${error.message}`);
      throw error;
    }
  }

  async verificarDisponibilidade(pedido: Pedido): Promise<boolean> {
    for (const item of pedido.itemPedidos) {
      const produto = await this.produtoRepository.findOne({
        where: { idProduto: item.produto.idProduto },
        select: ['estoque', 'estoqueReservado']
      });

      if (!produto) return false;

      const estoqueDisponivel = produto.estoque - produto.estoqueReservado;
      if (estoqueDisponivel < item.quantidade) {
        return false;
      }
    }
    return true;
  }

  async limparReservasExpiradas(): Promise<number> {
    try {
      const trintaMinutosAtras = new Date(Date.now() - 30 * 60 * 1000);
      const pedidosExpirados = await this.pedidoRepository
        .createQueryBuilder('pedido')
        .leftJoinAndSelect('pedido.itemPedidos', 'itemPedidos')
        .leftJoinAndSelect('itemPedidos.produto', 'produto')
        .where('pedido.statusPedido IN (:...status)', {
          status: ['Aberto', 'Aguardando pagamento']
        })
        .andWhere('pedido.dataPedido < :limite', { limite: trintaMinutosAtras })
        .getMany();

      let totalLiberado = 0;

      for (const pedido of pedidosExpirados) {
        try {
          for (const item of pedido.itemPedidos) {
            const { produto, quantidade } = item;

            await this.produtoRepository
              .createQueryBuilder()
              .update(Produto)
              .set({
                estoqueReservado: () => `GREATEST(estoqueReservado - ${quantidade}, 0)`
              })
              .where('idProduto = :id', { id: produto.idProduto })
              .execute();
          }

          pedido.statusPedido = Status.CANCELADO;
          await this.pedidoRepository.save(pedido);

          totalLiberado += pedido.itemPedidos.length;
          this.logger.log(`Pedido ${pedido.idPedido} expirado e cancelado`);
        } catch (error) {
          this.logger.error(`Erro ao processar pedido expirado ${pedido.idPedido}: ${error.message}`);
        }
      }

      return totalLiberado;
    } catch (error) {
      this.logger.error(`Erro na limpeza de reservas: ${error.message}`);
      return 0;
    }
  }
}