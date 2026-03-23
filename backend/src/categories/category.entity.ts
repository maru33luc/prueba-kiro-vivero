import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Plant } from '../plants/plant.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Plant, (p) => p.category)
  plants: Plant[];
}
