import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsUUID,
  IsUrl,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  careInstructions: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsUUID()
  categoryId: string;
}
