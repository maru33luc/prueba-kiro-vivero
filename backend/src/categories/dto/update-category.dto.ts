import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
