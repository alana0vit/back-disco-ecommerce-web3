import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProdutoModule } from './produto/produto.module';
import { ClienteModule } from './cliente/cliente.module';
import { EnderecoModule } from './endereco/endereco.module';
import { CategoriaModule } from './categoria/categoria.module';
import { PedidoModule } from './pedido/pedido.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { ProdutoService } from './produto/produto.service';
import { ProdutoController } from './produto/produto.controller';
import { CategoriaController } from './categoria/categoria.controller';
import { ClienteController } from './cliente/cliente.controller';
import { EnderecoController } from './endereco/endereco.controller';
import { PagamentoController } from './pagamento/pagamento.controller';
import { PedidoController } from './pedido/pedido.controller';
import { CategoriaService } from './categoria/categoria.service';
import { ClienteService } from './cliente/cliente.service';
import { EnderecoService } from './endereco/endereco.service';
import { PagamentoService } from './pagamento/pagamento.service';
import { PedidoService } from './pedido/pedido.service';
import { ItemPedidoModule } from './item-pedido/item-pedido.module';
import { ItemPedidoController } from './item-pedido/item-pedido.controller';
import { ItemPedidoService } from './item-pedido/item-pedido.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.getOrThrow<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ProdutoModule,
    ClienteModule,
    EnderecoModule,
    CategoriaModule,
    PedidoModule,
    PagamentoModule,
    ItemPedidoModule,
  ],
  controllers: [AppController, ProdutoController, CategoriaController, ClienteController, EnderecoController, PagamentoController, PedidoController, ItemPedidoController],
  providers: [AppService, ProdutoService, CategoriaService, ClienteService, EnderecoService, PagamentoService, PedidoService, ItemPedidoService],
})
export class AppModule { }
