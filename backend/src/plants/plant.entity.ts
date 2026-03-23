import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  careInstructions: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column()
  imageUrl: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Category, (c) => c.plants, { eager: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
