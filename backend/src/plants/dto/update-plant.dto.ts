import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsUUID,
  IsOptional,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlantDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  careInstructions?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
