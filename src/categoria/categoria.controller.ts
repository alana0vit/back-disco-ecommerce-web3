import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async create(
    @Body() createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  async findAll(): Promise<Categoria[]> {
    return await this.categoriaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Categoria> {
    return await this.categoriaService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoriaService.remove(+id);
  }
}
