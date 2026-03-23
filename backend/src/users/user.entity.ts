import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  resetPasswordExpires: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
