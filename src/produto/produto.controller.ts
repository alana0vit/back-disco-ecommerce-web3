import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async create(
    @Body() createProdutoDto: CreateProdutoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.produtoService.create(createProdutoDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get()
  async findAll(): Promise<Produto[]> {
    return await this.produtoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get('filtro')
  async findWithFilters(
    @Query('nome') nome?: string,
    @Query('categoria') categoria?: string,
    @Query('precoMin') precoMin?: string,
    @Query('precoMax') precoMax?: string,
  ): Promise<Produto[]> {
    const precoMinNum =
      precoMin && !isNaN(Number(precoMin)) ? Number(precoMin) : undefined;
    const precoMaxNum =
      precoMax && !isNaN(Number(precoMax)) ? Number(precoMax) : undefined;
    return await this.produtoService.findWithFilters(
      nome,
      categoria,
      precoMinNum,
      precoMaxNum,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get(':id')
  async findOneWithDisponivel(@Param('id') id: string) {
    return await this.produtoService.findOneWithDisponivel(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Produto> {
    return await this.produtoService.update(+id, updateProdutoDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.produtoService.remove(+id);
  }
}