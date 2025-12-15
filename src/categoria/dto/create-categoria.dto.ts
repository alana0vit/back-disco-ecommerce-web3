import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Eletrônicos',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Descrição da categoria (opcional)',
    example: 'Ritmos nacionais de 80s',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;
}
