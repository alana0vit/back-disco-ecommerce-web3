import { AuthModule } from './auth/auth.module';
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
import { ItemPedidoModule } from './item-pedido/item-pedido.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ImagemModule } from './imagemProduto/imagem.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { CarrinhoItemModule } from './carrinho-item/carrinho-item.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.getOrThrow<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        extra: {
          max: 10,
          idleTimeoutMillis: 30000,
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ImagemModule,
    ProdutoModule,
    ClienteModule,
    EnderecoModule,
    CategoriaModule,
    PedidoModule,
    PagamentoModule,
    ItemPedidoModule,
    AuthModule,
    CarrinhoModule,
    CarrinhoItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
