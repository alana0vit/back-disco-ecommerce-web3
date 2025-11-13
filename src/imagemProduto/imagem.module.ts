import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagem } from './entities/imagem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Imagem])],
  exports: [TypeOrmModule],
})
export class ImagemModule {}