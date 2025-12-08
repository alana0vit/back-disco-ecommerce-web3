import {PartialType } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/register.dto';

export class UpdateClienteDto extends PartialType(RegisterDto) {}
