import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/auth/register.dto';

export class UpdateClienteDto extends PartialType(RegisterDto) {}
