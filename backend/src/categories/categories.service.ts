import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepo.find({ where: { active: true } });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create({ name: dto.name });
    return this.categoryRepo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    category.name = dto.name;
    return this.categoryRepo.save(category);
  }

  async deactivate(id: string): Promise<void> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    category.active = false;
    await this.categoryRepo.save(category);
  }
}
