import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantFiltersDto } from './dto/plant-filters.dto';

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepo: Repository<Plant>,
  ) {}

  async findAll(filters: PlantFiltersDto): Promise<PagedResult<Plant>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.plantRepo
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.category', 'category')
      .where('plant.active = :active', { active: true });

    if (filters.categoryId) {
      qb.andWhere('plant.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.search) {
      qb.andWhere(
        '(LOWER(plant.name) LIKE LOWER(:search) OR LOWER(plant.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Plant> {
    const plant = await this.plantRepo.findOne({
      where: { id, active: true },
      relations: ['category'],
    });
    if (!plant) {
      throw new NotFoundException(`Plant with id ${id} not found`);
    }
    return plant;
  }

  async create(dto: CreatePlantDto): Promise<Plant> {
    if (dto.stock < 0) {
      throw new UnprocessableEntityException('Stock cannot be negative');
    }
    const plant = this.plantRepo.create(dto);
    return this.plantRepo.save(plant);
  }

  async update(id: string, dto: UpdatePlantDto): Promise<Plant> {
    const plant = await this.plantRepo.findOne({ where: { id } });
    if (!plant) {
      throw new NotFoundException(`Plant with id ${id} not found`);
    }
    if (dto.stock !== undefined && dto.stock < 0) {
      throw new UnprocessableEntityException('Stock cannot be negative');
    }
    Object.assign(plant, dto);
    return this.plantRepo.save(plant);
  }

  async softDelete(id: string): Promise<void> {
    const plant = await this.plantRepo.findOne({ where: { id } });
    if (!plant) {
      throw new NotFoundException(`Plant with id ${id} not found`);
    }
    plant.active = false;
    await this.plantRepo.save(plant);
  }
}
